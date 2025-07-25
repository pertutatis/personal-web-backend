type LogData = Record<string, unknown> | unknown

export class Logger {
  static info(message: string, data?: LogData): void {
    // console.log(`[INFO] ${message}`, data || '')
  }

  static error(message: string, data?: LogData): void {
    // console.error(`[ERROR] ${message}`, data || '')
  }

  static warn(message: string, data?: LogData): void {
    // console.warn(`[WARN] ${message}`, data || '')
  }

  static debug(message: string, data?: LogData): void {
    if (process.env.NODE_ENV === 'development') {
      // console.debug(`[DEBUG] ${message}`, data || '')
    }
  }

  private static formatError(data: LogData): Record<string, unknown> {
    if (data instanceof Error) {
      return {
        message: data.message,
        stack: data.stack,
        name: data.name,
      }
    }
    return data as Record<string, unknown>
  }
}
