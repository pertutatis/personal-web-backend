import { ArticleBookIds } from "../../ArticleBookIds";
import { BookIdMother } from "@/contexts/blog/book/domain/__tests__/mothers/BookIdMother";

export class ArticleBookIdsMother {
  static create(value: string[] = [
    "cc8d8194-e099-4e3a-a431-6b4412dc5f6a",
    "7d7f60ce-5a49-4be7-8c5e-c4b4375087c8"
  ]): ArticleBookIds {
    return ArticleBookIds.create(value);
  }

  static random(count: number = 2): ArticleBookIds {
    const bookIds: string[] = [];
    for (let i = 0; i < count; i++) {
      bookIds.push(BookIdMother.random().value);
    }
    return ArticleBookIds.create(bookIds);
  }

  static withOne(): ArticleBookIds {
    return ArticleBookIds.create([BookIdMother.random().value]);
  }

  static withMany(count: number = 5): ArticleBookIds {
    return this.random(count);
  }

  static withDuplicates(): ArticleBookIds {
    const id = BookIdMother.random().value;
    return ArticleBookIds.create([id, id]);
  }

  static empty(): ArticleBookIds {
    return ArticleBookIds.create([]);
  }

  static fromValues(values: string[]): ArticleBookIds {
    return ArticleBookIds.create(values);
  }
}
