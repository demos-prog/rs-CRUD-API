import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import path from "path";
import { UsersService } from './users.service';
import { UserCreatingDto } from './dto/user.dto';
import { User } from '../constants';

const notFounfFile = path.join(__dirname, '..', '404.html');

export const usersRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const usersService = new UsersService();

  if (req.method === 'GET') {
    if (req.url === '/api/users') {
      usersService.users()
        .then((users: User[]) => {
          res.statusCode = 200;
          res.end(JSON.stringify(users))
        })
        .catch(err => {
          res.end(err)
        })
    } else {
      notFoud(res);
    }
  }

  if (req.method === 'POST') {
    if (req.url === '/api/users') {
      let body: any = [];
      req.on('data', chunk => {
        body.push(chunk);
      });
      req.on('end', () => {
        body = Buffer.concat(body).toString();
        const parsedBody = JSON.parse(body);
        
        if (!('username' in parsedBody && 'age' in parsedBody)) {
          res.statusCode = 400;
          res.end('Invalid request body');
          return;
        }

        const newUser: UserCreatingDto = {
          username: parsedBody.username,
          age: parsedBody.age
        }

        usersService.createUser(newUser)
          .then((user: User) => {
            res.statusCode = 201;
            res.end(JSON.stringify(user))
          })
          .catch(err => {
            res.end(err)
          })
      });
    } else {
      notFoud(res);
    }
  }
};

function notFoud(res: ServerResponse) {
  res.setHeader('Content-Type', 'text/html');
  const file = readFileSync(notFounfFile, 'utf-8');
  res.statusCode = 404;
  if (file) {
    res.end(file)
  } else {
    res.end('Not Found')
  }
}