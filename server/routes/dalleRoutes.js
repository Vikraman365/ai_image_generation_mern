import express, { response } from "express";

import * as dotenv from "dotenv";
import query from "./hugg.js";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Hello from dall-e");
});
// to create a route with a path parameter
router.route("/:prompt").get((req, res) => {
  // to send an image file as a response
  return res.sendFile(
    `${process.cwd()}/generated_images/${req.params.prompt}.png`
  );
});

const server_address = process.env.SERVER_ADDRESS || "http://localhost:8080";
// 9488375588 -> 1180
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await query({ prompt });
    console.log("aaa", response);
    res
      .status(200)
      .json({ photo: server_address + "/api/v1/dalle/" + response });
  } catch (error) {
    console.error(error);
    const errorMessage = error?.response?.error || "Internal Server Error";
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
