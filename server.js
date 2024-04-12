import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const client = await createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: 12824,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  const connect = await client.connect();
  connect && console.log("Redis connected");
  console.log(`Server is running on port ${port}`);
});
