import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null, 
});


// 🔹 Queue
const queue = new Queue("file-upload-queue", {
  connection,
});

// 🔹 Multer storage
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".pdf");
  },
});

const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  await queue.add("process-pdf", {
    originalName: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path,
  });

  res.status(200).json({
    message: "File uploaded & queued successfully",
    file: req.file.filename,
  });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
