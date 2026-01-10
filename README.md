# BrainEvo - EdTech SaaS Platform

A comprehensive SaaS platform for edtech companies featuring student dashboards, course management, assignments, live classes, and analytics.

## 📁 Project Structure

```
brainevo/
├── frontend/          # React/Next.js frontend application
├── backend/           # Node.js/Express backend API
├── docs/              # Documentation files
├── assets/            # Static assets (images, icons, etc.)
├── tests/             # Shared test utilities and configurations
└── package.json       # Root package.json for monorepo management
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (or your preferred database)

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` files in both `frontend/` and `backend/` directories
   - Fill in the required values

4. Start development servers:
   ```bash
   npm run dev
   ```

This will start both frontend and backend servers concurrently.

## 📦 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run tests for both frontend and backend
- `npm run lint` - Lint both frontend and backend code

## 🏗️ Architecture

### Frontend
- **Framework**: React/Next.js
- **Styling**: Tailwind CSS
- **State Management**: (To be configured)
- **Routing**: Next.js App Router

### Backend
- **Framework**: Node.js/Express
- **Database**: (To be configured)
- **Authentication**: JWT-based
- **API**: RESTful API

## 📝 Documentation

See the `/docs` directory for:
- API documentation
- Platform guides
- Development guidelines
- Deployment instructions

## 🤝 Contributing

Please follow the established code structure and naming conventions. See `/docs` for detailed guidelines.

## 📄 License

ISC

