import express, { Request, Response } from "express";
import * as http from "http";
import { Server } from "socket.io";
import { Player } from "./types";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

const players: Player = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  players[socket.id] = {
    position: { x: 200, y: 200 },
    velocity: { x: 0, y: 0 },
  };
  io.emit("updateEnemy", players);
  console.log(players);
});

io.on("disconnect", (socket) => {
  delete players[socket.id];
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
