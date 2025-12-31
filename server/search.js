import "dotenv/config";
import { embeddings } from "./embeddings.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const run = async () => {
  // 1️⃣ Load vector store
  const store = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: process.env.QDRANT_COLLECTION,
    }
  );

  const question = "Which is the subject there?";

  // 2️⃣ Retrieve relevant chunks
  const docs = await store.similaritySearch(question, 3);

  const context = docs.map((d) => d.pageContent).join("\n\n");

  // 3️⃣ Gemini LLM
  const llm = new ChatGoogleGenerativeAI({
   model: "gemini-2.0-flash",
    temperature: 0.2, 
  });

  // 4️⃣ Prompt (THIS IS THE KEY PART)
  const prompt = `
You are an expert academic assistant.

Based ONLY on the context below, answer the user's question clearly and concisely.
If the subject or topic can be identified, mention it explicitly.
If the context is insufficient, say "The subject cannot be determined from the document."

Context:
${context}

Question:
${question}

Answer:
`;

  // 5️⃣ Generate final answer
  const response = await llm.invoke(prompt);

  console.log("\n🧠 FINAL ANSWER:\n");
  console.log(response.content);
};

run();
