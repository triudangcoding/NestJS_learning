import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcrypt";

const SaltRounds = 10;

@Injectable()
export class HashingService {
  async hash(password: string): Promise<string> {
    return hash(password, SaltRounds);
  }
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}