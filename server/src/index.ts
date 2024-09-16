import express, { Request, Response } from "express";
import * as http from "http";
import { Server } from "socket.io";
import { Lobby, Players } from "./types";

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

const lobby: Lobby = {};

// Initialize players object
const players: Players = {};

io.on("connection", (socket) => {
  console.log(`A user connected with socket ID: ${socket.id}`);

  socket.on("start-game", (data) => {
    console.log("🚀 ~ socket.on ~ data:", data);
    lobby[data.id] = {
      playerOneBetPlaced: false,
      playerOneId: data.playerOneId,
      playerOneUsername: data.playerOneUsername,
      betAmount: data.betAmount,
    };
    console.log("🚀 ~ socket.on ~ lobby:", lobby);
    io.emit("updatedLobby", lobby);
  });

  socket.on("join-game", (data) => {
    lobby[data.id] = {
      playerTwoBetPlaced: false,
      playerTwoId: data.player,
      playerTwoUsername: data.username,
    };
    io.emit("updatedLobby", lobby);
    if (
      lobby[data.id].playerOneBetPlaced &&
      lobby[data.id].playerTwoBetPlaced
    ) {
      io.emit("navigate-game", data.id);
    }
  });

  socket.on("place-bet", (data) => {
    if (lobby[data.id].playerOneId === data.player) {
      lobby[data.id] = {
        playerOneBetPlaced: true,
      };
    }
    if (lobby[data.id].playerTwoId === data.player) {
      lobby[data.id] = {
        playerOneBetPlaced: true,
      };
    }
    io.emit("updatedLobby", lobby);
  });

  // Initialize player for this connection
  socket.on("walletConnect", (wallet) => {
    if (
      wallet &&
      !players[wallet] &&
      (wallet != "null" || wallet != "undefined")
    ) {
      players[wallet] = {
        velocity: { x: 0, y: 0 },
        isAttacking: false,
        health: 100,
        action: "IDLE",
      };
      io.emit("updatePlayers", players);
    }
  });

  socket.on("attack", (wallet) => {
    if (!wallet || wallet == "null" || wallet == "undefined") {
      return;
    }
    if (players[wallet].health > 0) {
      players[wallet].health -= 1;
      players[wallet].action = "TAKE_HIT";
      io.emit("updatePlayers", players);
      setTimeout(() => {
        if (players[wallet].health > 0) {
          players[wallet].action = "IDLE";
          io.emit("updatePlayers", players);
        }
      }, 250);
    } else {
      players[wallet].action = "DEATH";
      io.emit("updatePlayers", players);
    }
    console.log(players);
  });

  socket.on("keydown", (player) => {
    console.log("keydown", player.key);
    if (
      !player.player ||
      player.player == "null" ||
      player.player == "undefined"
    ) {
      console.log("player not found");
      return;
    } else if (players[player.player].health <= 0) {
      console.log("player is dead");
      return;
    }
    switch (player.key) {
      case "a":
        players[player.player].velocity.x = -5;
        players[player.player].action = "RUN";
        break;
      case "d":
        players[player.player].velocity.x = 5;
        players[player.player].action = "RUN";
        break;
      case "w":
        players[player.player].velocity.y = -20;
        players[player.player].action = "JUMP";
        break;
      case "space":
        players[player.player].isAttacking = true;
        players[player.player].action = "ATTACK";
        break;
    }
    io.emit("updatePlayers", players);
    console.log("keydown: current players ::", players);
  });

  socket.on("keyup", (player) => {
    if (
      !player.player ||
      player.player == "null" ||
      player.player == "undefined"
    ) {
      console.log("player not found");
      return;
    } else if (players[player.player].health <= 0) {
      console.log("player is dead");
      return;
    }
    switch (player.key) {
      case "a":
        players[player.player].velocity.x = 0;
        players[player.player].action = "IDLE";
        break;
      case "d":
        players[player.player].velocity.x = 0;
        players[player.player].action = "IDLE";
        break;
      case "w":
        players[player.player].velocity.y = 0;
        players[player.player].action = "IDLE";
        break;
      case "space":
        players[player.player].action = "IDLE";
        players[player.player].isAttacking = false;
        break;
    }
    io.emit("updatePlayers", players);
    console.log("keyup: current players ::", players);
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
