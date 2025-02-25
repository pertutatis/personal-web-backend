import { UuidGenerator } from '../domain/UuidGenerator';
import crypto from 'crypto';

export class OfficialUuidGenerator implements UuidGenerator {
  async generate(): Promise<string> {
    return crypto.randomUUID();
  }
}
