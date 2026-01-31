# 🐍 Real Time Snake Multiplayer Game

A modern, real-time multiplayer snake game built with React, TypeScript, and Socket.IO. Players can join rooms and compete against each other in classic snake gameplay with real-time updates and smooth animations. 🎯✨

## 🎮 Features

- **Real-time Multiplayer** 🕹️: Play with up to 10 players in the same room
- **Room System** 🚪: Create custom rooms with unique IDs for friends
- **Smooth Gameplay** ⚡: Optimized game loop with consistent tick rate
- **Responsive Design** 📱💻: Works on various screen sizes
- **Modern UI** 🎨: Built with React, Tailwind CSS, and Framer Motion
- **3D Graphics** 🌟: Enhanced visuals using React Three Fiber
- **Custom Skins** 👻🌈: Personalize your snake with different skins
- **Boost Mechanic** 🚀: Temporary speed boost for strategic gameplay
- **Respawn Feature** ♾️: Continue playing after collision

## 🛠️ Tech Stack

<div align="center">

### 🎨 Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/FramerMotion-0055FF?style=for-the-badge&logo=framer)
![React Router](https://img.shields.io/badge/ReactRouter-CA4245?style=for-the-badge&logo=react-router)
![Socket.IO Client](https://img.shields.io/badge/Socket.IO_Client-010101?style=for-the-badge&logo=socketdotio)
![React Three Fiber](https://img.shields.io/badge/ReactThreeFiber-000000?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-002D72?style=for-the-badge&logo=threedotjs)

---

### ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio)
![UUID](https://img.shields.io/badge/UUID-000000?style=for-the-badge&logo=uuid)
![CORS](https://img.shields.io/badge/CORS-000000?style=for-the-badge)

</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone 
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd BackEnd
npm install

# Install frontend dependencies
cd ../FrontEnd
npm install
```

3. Set up environment variables:

Create a `.env` file in the `BackEnd` directory with the following content:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Running the Application

1. Start the backend server:

```bash
cd BackEnd
npm start
# or
node server.js
```

2. Start the frontend development server:

```bash
cd FrontEnd
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. Visit the homepage and enter your username
2. Choose to either create a new room or join an existing one
3. In the game room, use arrow keys to control your snake
4. Eat food to grow longer and earn points
5. Avoid colliding with walls, other snakes, or yourself
6. Use the spacebar to activate boost for temporary speed increase
7. When you die, you can respawn and continue playing

## 🏗️ Project Structure

```
Real-Time-Snake-Multiplayer/
├── BackEnd/
│   ├── game/
│   │   ├── constants.js      # Game constants (grid size, tick rate)
│   │   ├── foodGeneration.js # Food placement logic
│   │   └── snake.js          # Snake movement and collision logic
│   ├── utils/
│   │   └── rooms.js          # Room management utilities
│   ├── server.js             # Main server file
│   └── package.json
└── FrontEnd/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React context providers
    │   ├── game/             # Game-specific components and logic
    │   │   ├── components/   # Game UI components
    │   │   ├── hooks/        # Custom game hooks
    │   │   ├── types/        # TypeScript type definitions
    │   │   ├── constants.ts  # Frontend game constants
    │   │   └── Canvas.tsx    # Main game canvas
    │   ├── App.tsx           # Main application component
    │   └── main.tsx          # Application entry point
    ├── index.html
    └── package.json
```

## 📊 Game Mechanics

- **Grid Size**: 20x20 cells
- **Map Dimensions**: 40 (width) x 30 (height)
- **Tick Rate**: 5 ticks per second
- **Max Players**: Up to 10 players per room
- **Boost**: Temporary speed increase when stamina is available
- **Respawn**: Players can respawn after collision

## 🔧 Environment Variables

### Backend

- `PORT`: Port number for the server (default: 3000)
- `CLIENT_URL`: Allowed origin for CORS (e.g., http://localhost:5173)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues or have suggestions for improvements, please open an issue in the repository.
