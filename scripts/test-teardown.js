const { execSync } = require('child_process')

module.exports = async () => {
  try {
    // Terminate active connections before dropping databases
    // console.info('Terminating active connections to test databases...');
    execSync(
      'docker compose exec -T blog-db psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname IN (\'test_blog\')"',
    )
    // console.info('✅ Active connections terminated');

    // Clean up test databases
    // console.info('Cleaning up test databases...');
    execSync(
      'docker compose exec -T blog-db psql -U postgres -c "DROP DATABASE IF EXISTS test_blog"',
    )
    // console.info('✅ Test databases dropped');

    // console.info('✅ Test environment cleaned up successfully\n');
  } catch (error) {
    // console.error('\n❌ Failed to clean up test environment:', error);
    process.exit(1)
  }
}
