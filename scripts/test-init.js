const { execSync } = require('child_process')
const { existsSync } = require('fs')
const path = require('path')
const { Logger } = require('./src/contexts/shared/infrastructure/Logger')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
}

function log(message, color = colors.reset) {
  Logger.info(color + message + colors.reset)
}

function executeCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: 'inherit' })
    return true
  } catch (error) {
    log(`\n${errorMessage}\n`, colors.red)
    log(error.message, colors.red)
    return false
  }
}

async function main() {
  log('\nInitializing test environment...', colors.blue)

  // Check if Docker is running
  try {
    execSync('docker info > /dev/null 2>&1')
  } catch (error) {
    log('\nDocker is not running. Please start Docker first.', colors.red)
    process.exit(1)
  }

  // Check if SQL files exist
  const sqlFiles = ['blog.sql']
  for (const file of sqlFiles) {
    const filePath = path.join(__dirname, '..', 'databases', file)
    if (!existsSync(filePath)) {
      log(`\nMissing SQL file: ${file}`, colors.red)
      process.exit(1)
    }
  }

  // Stop any running containers and remove volumes
  log('\nStopping existing containers...', colors.yellow)
  executeCommand('docker compose down -v', 'Failed to stop containers')

  // Start fresh containers
  log('\nStarting new containers...', colors.yellow)
  if (!executeCommand('docker compose up -d', 'Failed to start containers')) {
    process.exit(1)
  }

  // Wait for containers to be ready
  log('\nWaiting for containers to be ready...', colors.yellow)
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // Run verify script
  log('\nVerifying database setup...', colors.yellow)
  if (
    !executeCommand(
      'ts-node scripts/verify-test-env.ts',
      'Database verification failed',
    )
  ) {
    process.exit(1)
  }

  log('\n✅ Test environment initialized successfully!', colors.green)
}

// Handle script errors
process.on('unhandledRejection', (error) => {
  log('\nUnhandled promise rejection:', colors.red)
  log(error.message, colors.red)
  process.exit(1)
})

// Run the script
main().catch((error) => {
  log('\nScript failed:', colors.red)
  log(error.message, colors.red)
  process.exit(1)
})
