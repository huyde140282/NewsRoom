# NewsRoom Development Makefile

.PHONY: help setup dev stop clean logs build test

# Default target
help:
	@echo "NewsRoom Development Commands:"
	@echo "  make setup    - Initial setup with Docker (recommended for new developers)"
	@echo "  make dev      - Start development environment"
	@echo "  make stop     - Stop all services"
	@echo "  make clean    - Clean up containers and volumes"
	@echo "  make logs     - Show logs from all services"
	@echo "  make build    - Build all images"
	@echo "  make test     - Run tests"

# Initial setup for new developers
setup:
	@echo "🚀 Setting up NewsRoom development environment..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ .env file created"; fi
	@docker-compose -f docker-compose.dev.yml down -v
	@docker-compose -f docker-compose.dev.yml up --build -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 15
	@echo "🎉 Setup complete!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔧 Backend API: http://localhost:3001"

# Start development environment
dev:
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔧 Backend API: http://localhost:3001"

# Stop all services
stop:
	@docker-compose -f docker-compose.dev.yml down

# Clean up everything
clean:
	@docker-compose -f docker-compose.dev.yml down -v --rmi all
	@docker system prune -f

# Show logs
logs:
	@docker-compose -f docker-compose.dev.yml logs -f

# Build images
build:
	@docker-compose -f docker-compose.dev.yml build

# Run tests
test:
	@docker-compose -f docker-compose.dev.yml exec backend npm run test
	@docker-compose -f docker-compose.dev.yml exec frontend npm run test

# Database operations
db-reset:
	@docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d newsroom -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	@docker-compose -f docker-compose.dev.yml restart backend

# Install dependencies
install:
	@docker-compose -f docker-compose.dev.yml exec backend npm install
	@docker-compose -f docker-compose.dev.yml exec frontend npm install

# Shell access
backend-shell:
	@docker-compose -f docker-compose.dev.yml exec backend sh

frontend-shell:
	@docker-compose -f docker-compose.dev.yml exec frontend sh

db-shell:
	@docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d newsroom
