export type PaginationParams = {
  page: number;
  limit: number;
  total: number;
};

export class Collection<T> {
  constructor(
    readonly items: T[],
    readonly pagination: PaginationParams
  ) {
    this.ensureValidPagination(pagination);
  }

  private ensureValidPagination(pagination: PaginationParams): void {
    if (pagination.page <= 0 || pagination.limit <= 0) {
      throw new Error('Invalid pagination parameters');
    }
  }

  static create<T>(items: T[], pagination: PaginationParams): Collection<T> {
    return new Collection<T>(items, pagination);
  }

  static empty<T>(page: number = 1, limit: number = 10): Collection<T> {
    return new Collection<T>([], {
      page,
      limit,
      total: 0
    });
  }

  map<U>(fn: (item: T) => U): Collection<U> {
    return new Collection<U>(
      this.items.map(fn),
      this.pagination
    );
  }

  filter(fn: (item: T) => boolean): Collection<T> {
    const filteredItems = this.items.filter(fn);
    return new Collection<T>(
      filteredItems,
      {
        ...this.pagination,
        total: filteredItems.length
      }
    );
  }

  get length(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get hasNext(): boolean {
    const { page, limit, total } = this.pagination;
    return page * limit < total;
  }

  get hasPrevious(): boolean {
    return this.pagination.page > 1;
  }

  get totalPages(): number {
    const { limit, total } = this.pagination;
    return total === 0 ? 0 : Math.ceil(total / limit);
  }

  toPrimitives<R>(): { items: R[]; total: number; page: number; limit: number } {
    return {
      items: this.items.map((item: any) =>
        item.toPrimitives ? item.toPrimitives() : item
      ),
      total: this.pagination.total,
      page: this.pagination.page,
      limit: this.pagination.limit
    };
  }
}
