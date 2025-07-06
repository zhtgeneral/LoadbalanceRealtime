# 🔄 LoadbalanceRealtime

✨ **What this app does:**  
This app allows users to send and receive notifications between devices in real-time by entering and sharing messages.

---

## 🚀 Features

- ⚡ **Socket.io** - Enables instant updates for all connected clients without page refreshes
- 🧠 **Redis** - Powers the load balancing capabilities
- ⚛️ **React + Vite** - Delivers a responsive frontend with fast dev environment performance
- 🌐 **Express** - Facilitates communication between frontend clients
- 🧪 **Mocha/Chai/Sinon** - Provides comprehensive testing for backend API routes

---

## 🏁 Quick-start Instructions

### Prerequisites

1. Install Docker (required for the project)  
   [Get Docker here](https://www.docker.com/)

### Setup

```bash
# 1. Clone the project
git clone https://github.com/zhtgeneral/LoadbalanceRealtime.git

# 2. Install dependencies
cd LoadbalanceRealtime 
cd client && npm install
cd ../server && npm install
```

## 💻 Running the services

### **Backend Service** (run from /server directory):

```bash
npm run start
```

This will:

- 🐳 Launch a Redis Docker container
- 🚀 Start the Express backend server

### Frontend Service (in a new terminal, from /client directory):

```bash
npm run dev
```

This will:

- ⚛️ Launch the React development server