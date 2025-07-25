import { ArticleBookReferenceRemover } from '../ArticleBookReferenceRemover'
import { ArticleRepository } from '../../domain/ArticleRepository'
import { BookDeletedDomainEvent } from '@/contexts/backoffice/book/domain/event/BookDeletedDomainEvent'
import { RemoveBookReference } from '../RemoveBookReference'
import { BookId } from '@/contexts/backoffice/book/domain/BookId'
import { v4 as uuidv4 } from 'uuid'

describe('ArticleBookReferenceRemover', () => {
  let repository: jest.Mocked<ArticleRepository>
  let removeBookReference: RemoveBookReference
  let remover: ArticleBookReferenceRemover

  beforeEach(() => {
    repository = {
      removeBookReference: jest.fn(),
    } as any

    removeBookReference = new RemoveBookReference(repository)
    remover = new ArticleBookReferenceRemover(removeBookReference)
  })

  it('should subscribe to BookDeletedDomainEvent', () => {
    const subscribedEvents = remover.subscribedTo()

    expect(subscribedEvents).toEqual([BookDeletedDomainEvent.EVENT_NAME])
  })

  it('should remove book reference when handling BookDeletedDomainEvent', async () => {
    const bookId = uuidv4()
    const event = new BookDeletedDomainEvent({
      aggregateId: bookId,
      occurredOn: new Date(),
    })

    repository.removeBookReference.mockResolvedValue()

    await remover.on(event)

    expect(repository.removeBookReference).toHaveBeenCalledWith(
      expect.any(BookId),
    )
    const calledWithBookId = repository.removeBookReference.mock
      .calls[0][0] as BookId
    expect(calledWithBookId.value).toBe(bookId)
  })

  it('should propagate repository errors', async () => {
    const bookId = uuidv4()
    const event = new BookDeletedDomainEvent({
      aggregateId: bookId,
      occurredOn: new Date(),
    })
    const error = new Error('Repository error')

    repository.removeBookReference.mockRejectedValue(error)

    await expect(remover.on(event)).rejects.toThrow(error)
  })
})
