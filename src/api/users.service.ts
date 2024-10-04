import { createReadStream, createWriteStream } from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { UserCreatingDto } from "./dto/user.dto";
import { User } from "../constants";

const usersFile = path.join(__dirname, 'users.json');
export class UsersService {

  // Get all users
  async users(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      let result = '';
      createReadStream(usersFile)
        .on('data', (chunk) => {
          result += chunk.toString();
        })
        .on('end', () => {
          resolve(JSON.parse(result));
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // Create a user
  async createUser(user: UserCreatingDto): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      hobbies: [],
      ...user
    };

    return new Promise((resolve, reject) => {
      createReadStream(usersFile)
        .on('data', (chunk) => {
          let users: User[] = JSON.parse(chunk.toString());
          if (!Array.isArray(users)) {
            users = [];
          }
          users.push(newUser)

          createWriteStream(usersFile)
            .write(JSON.stringify(users), (error) => {
              if (error) {
                reject(error);
              } else {
                resolve(newUser);
              }
            })
        })

    });
  }
}