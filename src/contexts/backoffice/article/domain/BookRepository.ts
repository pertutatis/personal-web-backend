export interface BookRepository {
  exists(id: string): Promise<boolean>
}
