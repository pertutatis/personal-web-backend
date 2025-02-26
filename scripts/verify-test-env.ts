import { PostgresConnection } from '../src/contexts/shared/infrastructure/PostgresConnection';
import { getTestConfig } from '../src/contexts/shared/infrastructure/config/DatabaseConfig';
import * as fs from 'fs';
import * as path from 'path';

async function loadSqlFile(databaseType: 'articles' | 'books'): Promise<string> {
  const filePath = path.join(__dirname, '..', 'databases', `${databaseType}.sql`);
  return fs.readFileSync(filePath, 'utf8');
}

async function createDatabase(type: 'articles' | 'books'): Promise<void> {
  const name = `test_${type}`;
  const port = type === 'articles' ? 5432 : 5433;
  
  // Connect to default database first
  const defaultConfig = {
    host: process.env.DB_HOST || 'localhost',
    port,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  };

  let defaultConnection: PostgresConnection | undefined;
  
  try {
    defaultConnection = await PostgresConnection.create(defaultConfig);
    
    // Drop database if exists and create it again
    await defaultConnection.execute(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = '${name}'
    `);
    await defaultConnection.execute(`DROP DATABASE IF EXISTS ${name}`);
    await defaultConnection.execute(`CREATE DATABASE ${name}`);
    
    console.log(`✅ Database ${name} created`);
  } catch (error) {
    console.error(`❌ Failed to create database ${name}:`, error);
    throw error;
  } finally {
    if (defaultConnection) {
      await defaultConnection.close().catch(console.error);
    }
  }
}

async function verifyDatabase(type: 'articles' | 'books'): Promise<void> {
  const name = `test_${type}`;
  console.log(`\nVerifying ${name} database...`);
  
  try {
    // Create database if it doesn't exist
    await createDatabase(type);

    // Connect to the newly created database
    const config = getTestConfig(name);
    const connection = await PostgresConnection.create(config);

    try {
      // Load and apply schema
      const schema = await loadSqlFile(type);
      await connection.execute(schema);
      console.log(`✅ Schema applied to ${name}`);

      // Verify tables
      const tables = await connection.execute<{ table_name: string }>(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      
      console.log('Tables found:', tables.rows.map(r => r.table_name).join(', '));
      
      // Verify constraints
      const constraints = await connection.execute<{ constraint_name: string }>(
        "SELECT constraint_name FROM information_schema.table_constraints WHERE table_schema = 'public'"
      );
      
      console.log('Constraints:', constraints.rows.map(r => r.constraint_name).join(', '));

    } finally {
      await connection.close().catch(console.error);
    }
  } catch (error) {
    console.error(`❌ Failed to verify ${name}:`, error);
    throw error;
  }
}

async function verifyDatabases() {
  console.log('Verifying test databases...');

  try {
    // Verify both databases
    await verifyDatabase('articles');
    await verifyDatabase('books');

    console.log('\n✅ All database connections verified successfully');
  } catch (error) {
    console.error('\n❌ Database verification failed:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Run verification
verifyDatabases().catch((error) => {
  console.error('Verification script failed:', error);
  process.exit(1);
});
