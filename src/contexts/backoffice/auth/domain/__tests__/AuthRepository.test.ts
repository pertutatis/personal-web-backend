import { AuthRepository } from '../AuthRepository'
import { User } from '../User'
import { UserId } from '../UserId'
import { EmailVO } from '../EmailVO'

describe('AuthRepository interface', () => {
  it('should define required repository methods', () => {
    type Repository = AuthRepository
    
    // Verificar que los tipos existan en la interfaz
    type RequiredMethods = {
      save(user: User): Promise<void>
      findById(id: UserId): Promise<User | null>
      findByEmail(email: EmailVO): Promise<User | null>
    }

    // Esta asignación fallará en tiempo de compilación si faltan métodos
    const ensureMethodsExist = (repo: Repository): RequiredMethods => repo
    
    // Si llegamos aquí, significa que todos los métodos requeridos están definidos
    expect(true).toBe(true)
  })
})
