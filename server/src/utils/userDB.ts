import fs from 'fs';
import path from 'path';
import { User, UsersDatabase, CreateUserDTO } from '../types/user';

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function initializeDatabase(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    const initialData: UsersDatabase = { users: [] };
    fs.writeFileSync(USERS_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readUsers(): User[] {
  initializeDatabase();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    const db: UsersDatabase = JSON.parse(data);
    return db.users || [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function writeUsers(users: User[]): boolean {
  initializeDatabase();
  try {
    const db: UsersDatabase = { users };
    fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

export function getUserByEmail(email: string): User | undefined {
  const users = readUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const users = readUsers();
  return users.find(user => user.id === id);
}

export function createUser(userData: CreateUserDTO): Omit<User, 'password'> | null {
  const users = readUsers();

  if (getUserByEmail(userData.email)) {
    return null;
  }

  const { v4: uuidv4 } = require('uuid');
  const now = new Date().toISOString();

  const newUser: User = {
    id: uuidv4(),
    email: userData.email.toLowerCase(),
    password: userData.password,
    createdAt: now,
    updatedAt: now,
  };

  users.push(newUser);

  if (writeUsers(users)) {
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  return null;
}
