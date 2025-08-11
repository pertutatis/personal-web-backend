import { Container } from '@/contexts/shared/infrastructure/container/Container'
import { SeriesModule } from '@/contexts/backoffice/series/infrastructure/DependencyInjection/series.module'
import { SeriesService } from '@/contexts/backoffice/series/infrastructure/SeriesService'

class AppContainer implements Container {
  private static instance: AppContainer
  private readonly services: Map<string, any>

  private constructor() {
    this.services = new Map()

    // Initialize modules
    const seriesModule = new SeriesModule()

    // Register services
    this.services.set(SeriesService.name, seriesModule)
  }

  static getInstance(): AppContainer {
    if (!AppContainer.instance) {
      AppContainer.instance = new AppContainer()
    }

    return AppContainer.instance
  }

  get<T>(type: any): T {
    const service = this.services.get(type)

    if (!service) {
      throw new Error(`Service ${type} not found in container`)
    }

    return service
  }
}

export const container = AppContainer.getInstance()
