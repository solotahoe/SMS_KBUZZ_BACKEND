# Backend API for [SUSCRIPION MANAGEMENT SYSTEM]



A robust backend service for subscriptions and users management

## Features
- ✅ User authentication (JWT)
- 📅 Subscription management
- ✅  User creation, edit, update, read and delete
- 🔄 Cron jobs for expiration checks

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI

### Installation
```bash
git clone https://github.com/your/repo.git
cd project-backend
npm install

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

npm start 

src
├── models/         # MongoDB schemas
├── routes/         # Express routers
├── services/       # Business logic
└── utils/          # Helper functions

🧑‍💻 Author
Solomon Mugwima