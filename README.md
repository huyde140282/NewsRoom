# NewsRoom - News Management Platform

A modern news management platform built with NestJS, Next.js, and PostgreSQL with Docker support.

## 🚀 Quick Start (Recommended)

For new developers who want to get started immediately:

### Option 1: Using Make (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd NewsRoom

# One-command setup (creates .env, builds containers, starts services)
make setup

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database: localhost:5432
```

### Option 2: Using Setup Script
```bash
# Clone the repository
git clone <repository-url>
cd NewsRoom

# Run the setup script
./setup.sh
```

### Option 3: Manual Docker Setup
```bash
# Clone the repository
git clone <repository-url>
cd NewsRoom

# Copy environment file
cp .env.example .env

# Start with Docker
docker-compose -f docker-compose.dev.yml up --build -d
```

## 📋 Prerequisites

- Docker & Docker Compose
- Git

That's it! No need to install Node.js, PostgreSQL, or any other dependencies locally.

## 🛠️ Development Commands

```bash
# Start development environment
make dev

# Stop all services
make stop

# View logs
make logs

# Clean up (remove containers, volumes, images)
make clean

# Reset database
make db-reset

# Run tests
make test

# Access shells
make backend-shell
make frontend-shell
make db-shell
```

## 🏗️ Project Structure

```
NewsRoom/
├── backend/              # NestJS API server
│   ├── src/
│   ├── Dockerfile
│   └── Dockerfile.dev
├── frontend/             # Next.js web application
│   ├── src/
│   ├── Dockerfile
│   └── Dockerfile.dev
├── docker-compose.yml    # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── .env.example         # Environment variables template
├── Makefile            # Development commands
└── setup.sh           # Setup script
```

## 🌐 API Endpoints

The API is versioned and available at `http://localhost:3001/api/v1/`

### Articles
- `GET /api/v1/articles` - List articles
- `GET /api/v1/articles/:id` - Get article by ID
- `POST /api/v1/articles` - Create article
- `PUT /api/v1/articles/:id` - Update article
- `DELETE /api/v1/articles/:id` - Delete article

### Categories
- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create category

### File Upload
- `POST /api/v1/upload` - Upload files

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for full list):

```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=newsroom

# Application
NODE_ENV=development
API_PORT=3001
WEB_PORT=3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Docker Services

- **postgres**: PostgreSQL database
- **backend**: NestJS API server
- **frontend**: Next.js web application

## 🧪 Testing

```bash
# Run backend tests
make test

# Or manually
docker-compose -f docker-compose.dev.yml exec backend npm run test
docker-compose -f docker-compose.dev.yml exec frontend npm run test
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Reset database
make db-reset

# Or manually
docker-compose -f docker-compose.dev.yml down -v
make setup
```

### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # Database

# Stop conflicting services or change ports in .env
```

### Container Issues
```bash
# Clean everything and start fresh
make clean
make setup
```

## 📚 Features

- ✅ API Versioning (v1)
- ✅ Article Management
- ✅ Category Management
- ✅ File Upload
- ✅ Comment System (Simplified)
- ✅ Docker Development Environment
- ✅ Database Migrations
- ✅ Responsive UI
- ✅ Environment Configuration

## 🚀 Production Deployment

```bash
# Build production images
docker-compose build

# Start production environment
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.