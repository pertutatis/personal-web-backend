import { Series } from '../Series'
import { SeriesId } from '../SeriesId'
import { SeriesTitle } from '../SeriesTitle'
import { SeriesDescription } from '../SeriesDescription'

describe('Series', () => {
  const validId = SeriesId.random()
  const validTitle = new SeriesTitle('Test Series')
  const validDescription = new SeriesDescription('Test Description')
  const validDate = new Date()

  it('should create a valid Series', () => {
    const series = Series.create({
      id: validId,
      title: validTitle,
      description: validDescription,
      createdAt: validDate,
      updatedAt: validDate,
    })

    expect(series.id).toBe(validId)
    expect(series.title).toBe(validTitle)
    expect(series.description).toBe(validDescription)
    expect(series.createdAt).toBe(validDate)
    expect(series.updatedAt).toBe(validDate)
  })

  it('should update series title and description', () => {
    const series = Series.create({
      id: validId,
      title: validTitle,
      description: validDescription,
      createdAt: validDate,
      updatedAt: validDate,
    })

    const newTitle = new SeriesTitle('Updated Series')
    const newDescription = new SeriesDescription('Updated Description')
    const updatedSeries = series.update({
      title: newTitle,
      description: newDescription,
    })

    expect(updatedSeries.title).toBe(newTitle)
    expect(updatedSeries.description).toBe(newDescription)
    expect(updatedSeries.updatedAt).not.toBe(validDate)
  })

  it('should not update when no changes provided', () => {
    const series = Series.create({
      id: validId,
      title: validTitle,
      description: validDescription,
      createdAt: validDate,
      updatedAt: validDate,
    })

    const updatedSeries = series.update({})

    expect(updatedSeries).toBe(series)
    expect(updatedSeries.updatedAt).toBe(validDate)
  })

  it('should only update title when only title is provided', () => {
    const series = Series.create({
      id: validId,
      title: validTitle,
      description: validDescription,
      createdAt: validDate,
      updatedAt: validDate,
    })

    const newTitle = new SeriesTitle('Updated Series')
    const updatedSeries = series.update({ title: newTitle })

    expect(updatedSeries.title).toBe(newTitle)
    expect(updatedSeries.description).toBe(validDescription)
    expect(updatedSeries.updatedAt).not.toBe(validDate)
  })

  it('should only update description when only description is provided', () => {
    const series = Series.create({
      id: validId,
      title: validTitle,
      description: validDescription,
      createdAt: validDate,
      updatedAt: validDate,
    })

    const newDescription = new SeriesDescription('Updated Description')
    const updatedSeries = series.update({ description: newDescription })

    expect(updatedSeries.title).toBe(validTitle)
    expect(updatedSeries.description).toBe(newDescription)
    expect(updatedSeries.updatedAt).not.toBe(validDate)
  })

  it('should generate proper domain events', () => {
    const series = Series.create({
      id: validId,
      title: validTitle,
      description: validDescription,
      createdAt: validDate,
      updatedAt: validDate,
    })

    const createdEvents = series.pullDomainEvents()
    expect(createdEvents).toHaveLength(1)
    expect(createdEvents[0]?.eventName).toBe('series.created')

    const newTitle = new SeriesTitle('Updated Series')
    const updatedSeries = series.update({ title: newTitle })

    const updatedEvents = updatedSeries.pullDomainEvents()
    expect(updatedEvents).toHaveLength(1)
    expect(updatedEvents[0]?.eventName).toBe('series.updated')
  })
})
