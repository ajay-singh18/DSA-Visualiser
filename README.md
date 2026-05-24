# Algoviz 2.0 (DSA Visualizer)

Algoviz 2.0 is an interactive, full-stack Data Structures and Algorithms (DSA) visualizer and execution tracer. It provides an immersive learning environment for students and developers to visualize complex algorithms step-by-step, compete in algorithm races, and test their knowledge with timed assessments.

## ✨ Features

*   **Interactive Visualizations:** Step-by-step, animated execution tracing for Sorting, Searching, Graphs (BFS, DFS, Dijkstra, etc.), Trees (BST operations, traversals), and Dynamic Programming.
*   **Integrated Code Editor:** Built-in `@monaco-editor` with live syntax highlighting that synchronizes with the visual algorithm execution.
*   **AI Tutoring:** Integrated with Google Generative AI (Gemini) to provide contextual hints, explain algorithm steps, and offer personalized tutoring while you trace algorithms.
*   **Algorithm Races:** "Race Mode" allows you to pit two algorithms (e.g., Bubble Sort vs. Quick Sort) against each other on identical datasets to visually and metrically compare performance.
*   **DSA Assessments:** Test your knowledge with timed quizzes, logic puzzles, and state prediction challenges. 
*   **User Profiles & Dashboards:** Track your learning progress with a GitHub-style activity heatmap, performance metrics, and unlockable achievement badges.
*   **Secure Authentication:** Secure user authentication using Google OAuth 2.0 and custom JWT-based sessions.

## 🛠️ Tech Stack

This project is structured as a scalable monorepo.

**Frontend (Client):**
*   React 19 & TypeScript
*   Vite
*   Framer Motion (for complex layout animations and state transitions)
*   Monaco Editor
*   React Router DOM

**Backend (Server):**
*   Node.js & Express.js
*   TypeScript
*   MongoDB & Mongoose (Data modeling for user stats, histories, and quizzes)
*   Google Generative AI SDK (Gemini)
*   JSON Web Tokens (JWT) & Google Auth Library

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed. You will also need a MongoDB instance running locally or a MongoDB Atlas connection string.

### Environment Variables

Create a `.env` file in `apps/server/` and configure the following variables:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file in `apps/client/` and configure the following:

```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Installation & Running

1. **Install dependencies from the root directory:**
   ```bash
   npm install
   ```

2. **Build the shared packages (if necessary):**
   ```bash
   npm run build:shared
   ```

3. **Start the backend server:**
   ```bash
   npm run dev:server
   ```
   *The server will typically start on port 5001.*

4. **Start the frontend client:**
   ```bash
   npm run dev:client
   ```
   *The Vite dev server will typically start on port 5173.*

## 📂 Project Structure

```text
dsa-visualizer/
├── apps/
│   ├── client/          # React frontend application
│   └── server/          # Express backend application
├── packages/
│   └── shared/          # Shared TypeScript interfaces and utility functions
├── package.json         # Root monorepo configuration
└── README.md
```