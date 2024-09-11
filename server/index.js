import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import cron from "node-cron";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

app.get("/", async (req, res) => {
  res.send("Hello from dall-e");
});

// Set up the cron job
cron.schedule("*/13 * * * *", async () => {
  try {
    const response = await axios.get("http://localhost:8080/");
    console.log("API call response:", response.data);
  } catch (error) {
    console.error("Error making API call:", error);
  }
});

console.log("Cron job set to make API call every 13 minutes");

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log(`Server is running on port 8080`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
