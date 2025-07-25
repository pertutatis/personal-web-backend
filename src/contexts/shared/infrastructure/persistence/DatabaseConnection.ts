import { QueryResult, QueryResultRow } from 'pg'

/**
 * Interfaz común para conexiones de base de datos.
 * Proporciona una abstracción sobre diferentes implementaciones (PostgreSQL, Supabase)
 */
export interface DatabaseConnection {
  /**
   * Ejecuta una consulta SQL y devuelve el resultado
   * @param query Consulta SQL a ejecutar
   * @param values Valores para los parámetros de la consulta
   * @returns Resultado de la consulta
   */
  execute<T extends QueryResultRow = any>(
    query: string,
    values?: any[],
  ): Promise<QueryResult<T>>

  /**
   * Cierra la conexión con la base de datos
   */
  close(): Promise<void>

  /**
   * Obtiene el nombre de la base de datos
   */
  getDatabase(): string
}
