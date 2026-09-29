package com.webscrapex.service;

import com.webscrapex.dto.ScheduleDto;
import com.webscrapex.dto.ScrapeRequestDto;
import com.webscrapex.entity.Schedule;
import com.webscrapex.entity.Source;
import com.webscrapex.exception.ResourceNotFoundException;
import com.webscrapex.repository.ScheduleRepository;
import com.webscrapex.repository.SourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private static final Logger log = LoggerFactory.getLogger(ScheduleService.class);

    private final ScheduleRepository scheduleRepository;
    private final SourceRepository sourceRepository;
    private final ScrapingService scrapingService;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           SourceRepository sourceRepository,
                           ScrapingService scrapingService) {
        this.scheduleRepository = scheduleRepository;
        this.sourceRepository = sourceRepository;
        this.scrapingService = scrapingService;
    }

    public List<ScheduleDto> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ScheduleDto getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        return convertToDto(schedule);
    }

    public ScheduleDto createSchedule(ScheduleDto dto) {
        Source source = sourceRepository.findById(dto.getSourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + dto.getSourceId()));

        Schedule schedule = new Schedule();
        schedule.setSourceId(source.getId());
        schedule.setFrequency(dto.getFrequency() != null ? dto.getFrequency() : "DAILY");
        schedule.setCronExpression(dto.getCronExpression());
        schedule.setActive(dto.getActive() != null ? dto.getActive() : true);
        schedule.setNextRun(calculateNextRun(schedule.getFrequency()));

        Schedule saved = scheduleRepository.save(schedule);
        return convertToDto(saved);
    }

    public ScheduleDto updateSchedule(Long id, ScheduleDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        if (dto.getFrequency() != null) {
            schedule.setFrequency(dto.getFrequency());
            schedule.setNextRun(calculateNextRun(dto.getFrequency()));
        }
        if (dto.getCronExpression() != null) schedule.setCronExpression(dto.getCronExpression());
        if (dto.getActive() != null) schedule.setActive(dto.getActive());

        Schedule updated = scheduleRepository.save(schedule);
        return convertToDto(updated);
    }

    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    // Runs every minute to check if any active schedules are due for execution
    @Scheduled(fixedDelay = 60000)
    public void executeDueSchedules() {
        List<Schedule> activeSchedules = scheduleRepository.findByActiveTrue();
        ZonedDateTime now = ZonedDateTime.now();

        for (Schedule schedule : activeSchedules) {
            if (schedule.getNextRun() == null || schedule.getNextRun().isBefore(now)) {
                log.info("Executing scheduled scraping job for schedule ID: {}, source ID: {}", schedule.getId(), schedule.getSourceId());
                sourceRepository.findById(schedule.getSourceId()).ifPresent(source -> {
                    try {
                        ScrapeRequestDto req = new ScrapeRequestDto();
                        req.setUrl(source.getUrl());
                        req.setSourceId(source.getId());
                        req.setMode(source.getContentType() != null ? source.getContentType() : "COMPLETE_PAGE");
                        req.setCleanData(true);
                        req.setSaveToDb(true);

                        scrapingService.executeScrapeJob(req);

                        schedule.setLastRun(now);
                        schedule.setNextRun(calculateNextRun(schedule.getFrequency()));
                        scheduleRepository.save(schedule);

                    } catch (Exception e) {
                        log.error("Scheduled scrape failed for schedule ID {}", schedule.getId(), e);
                    }
                });
            }
        }
    }

    private ZonedDateTime calculateNextRun(String frequency) {
        ZonedDateTime now = ZonedDateTime.now();
        switch (frequency.toUpperCase()) {
            case "HOURLY": return now.plusHours(1);
            case "EVERY_6_HOURS": return now.plusHours(6);
            case "DAILY": return now.plusDays(1);
            case "WEEKLY": return now.plusWeeks(1);
            default: return now.plusDays(1);
        }
    }

    private ScheduleDto convertToDto(Schedule schedule) {
        ScheduleDto dto = new ScheduleDto();
        dto.setId(schedule.getId());
        dto.setSourceId(schedule.getSourceId());
        dto.setFrequency(schedule.getFrequency());
        dto.setCronExpression(schedule.getCronExpression());
        dto.setActive(schedule.getActive());
        dto.setNextRun(schedule.getNextRun());
        dto.setLastRun(schedule.getLastRun());
        dto.setCreatedAt(schedule.getCreatedAt());

        sourceRepository.findById(schedule.getSourceId()).ifPresent(src -> {
            dto.setSourceName(src.getName());
            dto.setSourceUrl(src.getUrl());
        });

        return dto;
    }
}
