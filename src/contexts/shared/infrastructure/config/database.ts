import { DatabaseConfig } from '../persistence/DatabaseConnectionFactory';
import { Logger } from '../Logger';

export function getDatabaseConfig(): DatabaseConfig {
  const environment = process.env.NODE_ENV || 'development';
  
  Logger.info('Loading database configuration', { environment });

  const config: DatabaseConfig = {
    database: process.env.DB_NAME,
  };

  if (environment === 'production') {
    config.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    config.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

    if (!config.supabaseUrl || !config.supabaseKey) {
      throw new Error('Missing required Supabase configuration');
    }
  } else {
    config.host = process.env.DB_HOST || 'localhost';
    config.port = Number(process.env.DB_PORT) || 5432;
    config.user = process.env.DB_USER || 'postgres';
    config.password = process.env.DB_PASSWORD || 'postgres';
  }

  Logger.info('Database configuration loaded', {
    environment,
    database: config.database,
    host: config.host,
    port: config.port,
    user: config.user,
    supabaseUrl: config.supabaseUrl ? '***' : undefined
  });

  return config;
}

export function getTestDatabaseConfig(database: string): DatabaseConfig {
  return {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database
  };
}


export function getBlogDatabaseConfig(): DatabaseConfig {
  return {
    ...getDatabaseConfig(),
    database: process.env.BLOG_DB_NAME || 'blog',
    port: Number(process.env.DB_PORT) || 5434
  };
}
