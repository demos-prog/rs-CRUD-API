import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import path from "path";

const htmlFile = path.join(__dirname, '..', '404.html');

export const usersRoutes = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET') {
    if (req.url === '/api/users') {
      res.end('Users');
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
  }
};