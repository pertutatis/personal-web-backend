#!/bin/bash

echo "Setting up test environment..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Function to wait for database to be ready
wait_for_db() {
    local host=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    echo "Waiting for database at $host:$port..."
    while ! docker exec $3 pg_isready -h localhost -p 5432 > /dev/null 2>&1; do
        if [ $attempt -eq $max_attempts ]; then
            echo "Database not ready after $max_attempts attempts"
            exit 1
        fi
        echo "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 1
        attempt=$((attempt + 1))
    done
    echo "Database is ready!"
}

# Start docker containers if not running
if ! docker ps | grep -q "articles-db\|books-db"; then
    echo "Starting docker containers..."
    docker compose up -d

    # Wait for databases to be ready
    wait_for_db localhost 5432 articles-db
    wait_for_db localhost 5433 books-db
fi

# Function to setup a test database
setup_test_db() {
    local container=$1
    local db_name=$2
    local sql_file=$3

    echo "Setting up $db_name database..."
    
    # Connect to postgres database to create/reset test database
    if ! docker exec $container psql -U postgres -d postgres -c "\l" | grep -q "$db_name"; then
        echo "Creating $db_name database..."
        docker exec $container psql -U postgres -c "CREATE DATABASE $db_name"
    else
        echo "Dropping and recreating $db_name database..."
        docker exec $container psql -U postgres -c "DROP DATABASE $db_name"
        docker exec $container psql -U postgres -c "CREATE DATABASE $db_name"
    fi

    # Apply schema
    echo "Applying schema to $db_name..."
    docker exec $container psql -U postgres -d $db_name -f /docker-entrypoint-initdb.d/init.sql
}

# Setup test databases
setup_test_db articles-db test_articles /docker-entrypoint-initdb.d/init.sql
setup_test_db books-db test_books /docker-entrypoint-initdb.d/init.sql

# Create or update .env.test file
echo "Configuring environment variables..."
cat > .env.test << EOF
DB_HOST=localhost
ARTICLES_DB_PORT=5432
ARTICLES_DB_NAME=test_articles
ARTICLES_DB_USER=postgres
ARTICLES_DB_PASSWORD=postgres
BOOKS_DB_PORT=5433
BOOKS_DB_NAME=test_books
BOOKS_DB_USER=postgres
BOOKS_DB_PASSWORD=postgres
EOF

echo "Test environment setup complete!"
