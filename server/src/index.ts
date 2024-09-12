import express, { Request, Response } from "express";
import * as http from "http";
import { Server } from "socket.io";
import { Players } from "./types";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://betx-nine.vercel.app"],
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
        isAttacking: false,
      };
      io.emit("updatePlayers", players);
    }
  });

  socket.on("keydown", (player) => {
    console.log("keydown", player.key);
    if (!player.player) {
      console.log("player not found");
      return;
    }
    switch (player.key) {
      case "a":
        players[player.player].velocity.x = -5;
        break;
      case "d":
        players[player.player].velocity.x = 5;
        break;
      case "w":
        players[player.player].velocity.y = -20;
        break;
      case "space":
        players[player.player].isAttacking = true;
        break;
    }
    io.emit("updatePlayers", players);
  });

  socket.on("keyup", (player) => {
    if (!player.player) {
      console.log("player not found");
      return;
    }
    switch (player.key) {
      case "a":
        players[player.player].velocity.x = 0;
        break;
      case "d":
        players[player.player].velocity.x = 0;
        break;
      case "w":
        players[player.player].velocity.y = 0;
        break;
      case "space":
        players[player.player].isAttacking = false;
        break;
    }
    io.emit("updatePlayers", players);
  });

  socket.on("walletDisconnect", (wallet) => {
    delete players[wallet];
    io.emit("updatePlayers", players);
    console.log("🚀 ~ walletDisconnect ::", players);
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
