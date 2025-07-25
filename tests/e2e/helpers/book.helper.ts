import { test, expect } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'
import { AuthHelper } from './auth.helper'

export interface TestBook {
  id: string
  title: string
  author: string
  isbn: string
  description: string
  purchaseLink?: string
}

export class BookHelper {
  /**
   * Genera un ISBN-13 válido aleatorio
   */
  static generateRandomIsbn(): string {
    // Crear un prefijo ISBN-13
    // Primeros 12 dígitos (sin checksum)
    // 978/979 (prefijo EAN) + 9 dígitos aleatorios
    const prefix = Math.random() < 0.5 ? '978' : '979'
    let digits = prefix

    for (let i = 0; i < 9; i++) {
      digits += Math.floor(Math.random() * 10).toString()
    }

    // Calcular checksum
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += (i % 2 === 0 ? 1 : 3) * parseInt(digits[i])
    }
    const checksum = (10 - (sum % 10)) % 10

    // Añadir checksum al final
    return digits + checksum.toString()
  }

  /**
   * Genera un libro de prueba con ID y ISBN aleatorios
   */
  static generateRandomTestBook(overrides: Partial<TestBook> = {}): TestBook {
    return {
      id: uuidv4(),
      title: 'Test Book Title ' + Math.random().toString(36).substring(7),
      author: 'Test Author ' + Math.random().toString(36).substring(7),
      isbn: this.generateRandomIsbn(),
      description: 'Test book description',
      purchaseLink: 'https://example.com/book',
      ...overrides,
    }
  }

  /**
   * Crea un libro para pruebas
   */
  static async createBook(request: any, book: TestBook): Promise<Response> {
    return await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/books',
      {
        method: 'POST',
        data: book,
      },
    )
  }
}
