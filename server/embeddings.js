import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";


export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  taskType: "RETRIEVAL_DOCUMENT", // Optimized for document retrieval
});
