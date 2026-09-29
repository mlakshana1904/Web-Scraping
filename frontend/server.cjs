const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const BACKEND_PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    // Proxy request to Spring Boot Backend at localhost:8080
    const options = {
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Backend server at port 8080 is unreachable', message: err.message }));
    });

    req.pipe(proxyReq, { end: true });
    return;
  }

  // Serve index.html or static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const extname = String(path.extname(filePath)).toLowerCase();

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[extname] || 'text/html';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(__dirname, 'index.html'), (err, indexContent) => {
        if (err) {
          res.writeHead(500);
          res.end('Index file missing');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
  console.log(`Proxying /api calls to http://localhost:${BACKEND_PORT}`);
});
