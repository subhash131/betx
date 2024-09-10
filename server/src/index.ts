import express, { Request, Response } from "express";
import * as http from "http";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
