import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());

// simple list of jokes
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I would tell you a construction joke, but I'm still working on it.",
  "Why don't programmers like nature? It has too many bugs.",
  "What do you call fake spaghetti? An impasta!",
];

app.get("/joke", (req: Request, res: Response) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json({ joke: jokes[randomIndex] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
