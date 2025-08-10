import { Uuid } from '@/contexts/shared/domain/Uuid'

export class SeriesId extends Uuid {
  constructor(value: string) {
    super(value)
  }

  static random(): SeriesId {
    return new SeriesId(Uuid.random().value)
  }

  equals(other: SeriesId): boolean {
    return this.value === other.value
  }
}
