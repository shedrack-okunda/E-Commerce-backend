import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.PORT;

app.get("/user", (req, res) => {
  res.send(
    "Hello am trying to test this and see if it will render on the screen as the server runs.",
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
