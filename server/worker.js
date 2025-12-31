import "dotenv/config";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { getQdrantStore } from "./vectorStore.js";

// 🔹 Valkey / Redis connection (BullMQ requirement)
const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
});

// 🔹 Worker
new Worker(
  "file-upload-queue",
  async (job) => {
    try {
      console.log("📄 Processing:", job.data.originalName);

      // ✅ Safety check
      if (!job.data.path || !fs.existsSync(job.data.path)) {
        throw new Error(`File not found: ${job.data.path}`);
      }

      // 1️⃣ Read PDF
      const absolutePath = path.resolve(job.data.path);
      const buffer = fs.readFileSync(absolutePath);
      const pdfData = await pdf(buffer);

      if (!pdfData.text || pdfData.text.trim().length === 0) {
        throw new Error("PDF contains no readable text");
      }

      // 2️⃣ Better chunking (more semantic, less noise)
      const chunks = pdfData.text
        .split("\n\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 200);

      console.log(`✂️ ${chunks.length} chunks created`);

      if (chunks.length === 0) {
        throw new Error("No valid text chunks generated");
      }

      // 3️⃣ Get Qdrant vector store (from your existing file)
      const vectorStore = await getQdrantStore();

      // 4️⃣ Store embeddings
      await vectorStore.addDocuments(
        chunks.map((chunk, i) => ({
          pageContent: chunk,
          metadata: {
            source: job.data.originalName,
            chunk: i,
          },
        }))
      );

      console.log("✅ Stored embeddings in Qdrant Cloud");
    } catch (error) {
      console.error("❌ Worker failed:", error.message);
      throw error; // BullMQ will mark job as failed
    }
  },
  {
    connection,
    concurrency: 2, // optional but good practice
  }
);
