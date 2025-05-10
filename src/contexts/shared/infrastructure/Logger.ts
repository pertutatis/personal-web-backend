export class Logger {
  static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'test') {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  }

  static info(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'test') {
      console.log(`[INFO] ${message}`, ...args)
    }
  }

  static error(message: string, error?: any): void {
    if (process.env.NODE_ENV === 'test') {
      console.error(`[ERROR] ${message}`)
      if (error) {
        if (error instanceof Error) {
          console.error('Stack:', error.stack)
        } else {
          console.error('Error details:', error)
        }
      }
    }
  }
}
