import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import { notFoud, usersRoutes } from './api/users/users.controller';

dotenv.config();

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url?.startsWith('/api/users')) {
      usersRoutes(req, res);
    } else if (req.url === '/') {
      res.end('Hello from server');
    } else {
      notFoud(res);
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error: Something went wrong while processing your request.');
  }
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
})