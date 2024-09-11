import express, { Request, Response } from "express";
import * as http from "http";
import { Server } from "socket.io";
import { Players } from "./types";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://betx-nine.vercel.app/"],
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
  pingTimeout: 5000,
  pingInterval: 2000,
});

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

// Initialize players object
const players: Players = {};

io.on("connection", (socket) => {
  console.log(`A user connected with socket ID: ${socket.id}`);

  // Initialize player for this connection
  socket.on("walletConnect", (wallet) => {
    if (!players[wallet]) {
      players[wallet] = {
        velocity: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
      };
      io.emit("updatePlayers", players);
    }
  });

  socket.on("walletDisconnect", (wallet) => {
    delete players[wallet];
    io.emit("updatePlayers", players);
    console.log("🚀 ~ walletDisconnect ::", players);
  });

  socket.on("keyControl", (data) => {
    console.log(data);
    if (!data.walletAdd) return;
    if (!players[data.walletAdd]) {
      console.log("hello");
      players[data.walletAdd] = {
        velocity: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
      };
    }
    if (data.key === "d") {
      players[data.walletAdd].velocity.y = 1;
    } else if (data.key === "a") {
      players[data.walletAdd].velocity.y = -1;
    } else if (data.key === "w") {
      players[data.walletAdd].velocity.x = 10;
    } else {
      players[data.walletAdd].velocity.y = 0;
      players[data.walletAdd].velocity.x = 0;
    }
    socket.emit("updatePlayers", players);
    console.log("keyControl", players);
  });

  // Emit updated players list
  console.log("Current players:", players);

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
