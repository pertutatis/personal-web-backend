import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { PostgresBookRepository } from '@/contexts/backoffice/book/infrastructure/PostgresBookRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { UploadBookImage } from '@/contexts/backoffice/book/application/UploadBookImage'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

async function getConnection() {
  return await PostgresConnection.create(getBlogConfig())
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return executeWithErrorHandling(async () => {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      throw new ApiValidationError('image file is required')
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ApiValidationError('Image must be jpeg, png, or webp')
    }

    if (file.size > MAX_SIZE) {
      throw new ApiValidationError('Image must be less than 5MB')
    }

    const extension =
      file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1]
    const fileName = `${params.id}.${extension}`

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'books')
    await mkdir(uploadsDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(path.join(uploadsDir, fileName), buffer)

    const imageUrl = `/uploads/books/${fileName}`

    const connection = await getConnection()
    const repository = new PostgresBookRepository(connection)
    const uploadBookImage = new UploadBookImage(repository)

    await uploadBookImage.run(params.id, imageUrl)

    return HttpNextResponse.ok({ imageUrl }, request.headers.get('origin'))
  }, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection()
    const repository = new PostgresBookRepository(connection)
    const uploadBookImage = new UploadBookImage(repository)

    await uploadBookImage.run(params.id, '')

    return HttpNextResponse.noContent(request.headers.get('origin'))
  }, request)
}

export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request)
  return response
}
