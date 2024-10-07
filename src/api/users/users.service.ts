import { createReadStream, createWriteStream, writeFile } from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { UserCreatingDto } from "./dto/user.dto";
import { UserUpdatingDto } from "./dto/userUpdating.dto";
import { User } from "../../constants";

const usersFile = path.join(__dirname, 'users.json');
if (!usersFile) {
  writeFile(usersFile, '[]', ()=>{})
}

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

  // Get a user by ID
  async userById(id: string): Promise<User | null> {
    const users: User[] = await this.users();
    return users.find((user) => user.id === id) || null;
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

  // Update a user
  async updateUser(id: string, user: UserUpdatingDto): Promise<User | null> {
    const users: User[] = await this.users();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return null;
    }

    users[index] = { ...users[index], ...user };
    createWriteStream(usersFile).write(JSON.stringify(users));

    return users[index];
  }

  // Delete a user
  async deleteUser(id: string): Promise<boolean> {
    const users: User[] = await this.users();
    const filteredUsers = users.filter((user) => user.id !== id);
    createWriteStream(usersFile).write(JSON.stringify(filteredUsers));
    return true;
  }
}