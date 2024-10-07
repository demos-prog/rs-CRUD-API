import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import path from "path";
import { UsersService } from './users.service';
import { UserCreatingDto } from './dto/user.dto';
import { User } from '../../constants';
import { UserUpdatingDto } from './dto/userUpdating.dto';

const notFounfFile = path.join(__dirname, '..', '..', '404.html');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUserId(userId: string) {
  return uuidRegex.test(userId);
}

export const usersRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const usersService = new UsersService();

  if (req.method === 'GET') {
    if (req.url?.startsWith('/api/users/')) {
      const userId = req.url.split('/').pop();
      if (userId) {
        if (!isValidUserId(userId)) {
          res.statusCode = 400;
          res.end('Invalid user id');
          return;
        }

        usersService.userById(userId)
          .then((user: User | null) => {
            if (user) {
              res.statusCode = 200;
              res.end(JSON.stringify(user))
            } else {
              res.statusCode = 404;
              res.end('User not found')
            }
          })
          .catch(err => {
            res.end(err.toString())
          });
      }
    } else if (req.url === '/api/users') {
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

  if (req.method === 'PUT') {
    if (req.url?.startsWith('/api/users/')) {
      const userId = req.url.split('/').pop();
      if (userId) {
        if (!isValidUserId(userId)) {
          res.statusCode = 400;
          res.end('Invalid user id');
          return;
        }

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

          const updatedUser: UserUpdatingDto = {
            username: parsedBody.username,
            age: parsedBody.age,
            hobbies: parsedBody.hobbies
          }

          usersService.updateUser(userId, updatedUser)
            .then((user: User | null) => {
              if (user) {
                res.statusCode = 200;
                res.end(JSON.stringify(user))
              } else {
                res.statusCode = 404;
                res.end('User not found')
              }
            })
            .catch(err => {
              res.end(err)
            })
        });
      }
    } else {
      notFoud(res);
    }
  }

  if (req.method === 'DELETE') {
    if (req.url?.startsWith('/api/users/')) {
      const userId = req.url.split('/').pop();
      if (userId) {
        if (!isValidUserId(userId)) {
          res.statusCode = 400;
          res.end('Invalid user id');
          return;
        }

        usersService.deleteUser(userId)
          .then((isDeleted: boolean) => {
            if (isDeleted) {
              res.statusCode = 204;
              res.end('User deleted successfuly')
            } else {
              res.statusCode = 404;
              res.end('User not found')
            }
          })
          .catch(err => {
            res.end(err)
          })
      }
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