import { BookId } from "../../BookId";
import { OfficialUuidGenerator } from "@/contexts/shared/infrastructure/OfficialUuidGenerator";
import { v4 as uuidv4 } from 'uuid';

export class BookIdMother {
  static create(value: string = "cc8d8194-e099-4e3a-a431-6b4412dc5f6a"): BookId {
    return new BookId(value);
  }

  static random(): BookId {
    return new BookId(uuidv4());
  }

  static invalid(): BookId {
    return new BookId("invalid-id");
  }
}
