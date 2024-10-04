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

      const newUser: UserCreatingDto = {
        username: "Some user",
        age: 999
      }

      usersService.createUser(newUser)
        .then(message => {
          res.statusCode = 201;
          res.end(message)
        })
        .catch(err => {
          res.end(err)
        })
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