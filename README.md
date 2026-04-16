# 🚀 HLD Builder (System Design Playground)

An interactive web application to design, visualize, and validate system architectures using High-Level Design (HLD) concepts.

Users can create nodes (API, Service, Database), connect them, and simulate real-world backend architecture flows.

---

## 🧠 What Problem It Solves

Designing system architecture is usually done on whiteboards or static diagrams.

This tool helps:
- Visualize architecture dynamically
- Understand data flow between components
- Practice system design in an interactive way
- Validate correct architecture patterns (API → Service → DB)

---

## 🚀 Features

- 🎯 Add different node types (API, Service, Database)
- 🔗 Connect nodes to represent architecture flow
- 🧠 Smart validation (prevents bad architecture)
- ✏️ Edit node properties dynamically
- 🎨 Clean UI with interactive canvas
- 💾 Save architecture to database (MongoDB)
- ⚡ Real-time updates using state management

---

## 🧠 Architecture Flow
User → UI → API → Service → Database → Response


---

## 🛠️ Tech Stack

### Frontend
- React.js (with TypeScript)
- Redux (State Management)
- Tailwind CSS
- React Flow (for diagram visualization)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Concepts Used
- High Level System Design (HLD)
- REST APIs
- Component-based architecture
- State management

---

## 📁 Project Structure
project-root/
│
├── frontend/ # React + TypeScript UI
│
├── backend/ # Node.js + Express server
│
└── README.md


---

## ⚙️ Setup Instructions


---

### 2️⃣ Setup Frontend
cd frontend
npm install
npm run dev

---

### 3️⃣ Setup Backend
cd backend
npm install
node server.js

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

---

## 🌍 Future Improvements

- GraphQL integration
- gRPC communication between services
- Authentication & Authorization
- Drag & drop UI enhancements
- Deployment (AWS / Vercel / Docker)
- Export architecture as image / JSON

---

## 🎯 Learning Outcomes

This project demonstrates:

- Building full-stack MERN applications
- Applying system design concepts in real UI
- Managing global state using Redux
- Creating interactive UI using React Flow
- Connecting frontend with backend APIs
- Persisting data using MongoDB

---

## 👨‍💻 Author

**Achyuta Kalyan**

- Full Stack Developer (MERN)
- Interested in System Design, Scalable Architectures, and Backend Engineering

---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it helps!
