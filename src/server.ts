import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import path from "path";
import { usersRoutes } from './api/users';

const htmlFile = path.join(__dirname, '404.html');

dotenv.config();

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/') {
    res.end('Hello from server')
  } else if (req.url?.startsWith('/api/users')) {
    usersRoutes(req, res)
  } else {
    res.setHeader('Content-Type', 'text/html');
    const file = readFileSync(htmlFile, 'utf-8');
    res.statusCode = 404;
    if (file) {
      res.end(file)
    } else {
      res.end('Not Found')
    }
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
})