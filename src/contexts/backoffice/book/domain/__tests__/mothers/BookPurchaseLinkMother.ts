import { BookPurchaseLink } from '../../BookPurchaseLink'

export class BookPurchaseLinkMother {
  static create(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book')
  }

  static http(): BookPurchaseLink {
    return BookPurchaseLink.create('http://example.com/book')
  }

  static https(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book')
  }

  static withPort(): BookPurchaseLink {
    return BookPurchaseLink.create('https://localhost:3000/book')
  }

  static withSubdomain(): BookPurchaseLink {
    return BookPurchaseLink.create('https://api.example.com/book')
  }

  static withQueryParams(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book?id=123&ref=test')
  }

  static withFragment(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book#section1')
  }

  static withSpecialCharacters(): BookPurchaseLink {
    return BookPurchaseLink.create('https://libros.españa.com/libro')
  }

  static null(): BookPurchaseLink {
    return BookPurchaseLink.create(null)
  }

  static empty(): BookPurchaseLink {
    return BookPurchaseLink.create('')
  }

  static invalid(): BookPurchaseLink {
    return BookPurchaseLink.create('invalid')
  }

  static tooLong(): string {
    return 'https://example.com/' + 'a'.repeat(BookPurchaseLink.MAX_LENGTH)
  }

  static atMaxLength(): BookPurchaseLink {
    const baseUrl = 'https://example.com/'
    const remainingLength = BookPurchaseLink.MAX_LENGTH - baseUrl.length
    return BookPurchaseLink.create(baseUrl + 'a'.repeat(remainingLength))
  }

  static random(): BookPurchaseLink {
    const randomId = Math.random().toString(36).substring(7)
    return BookPurchaseLink.create(`https://example.com/book/${randomId}`)
  }
}
