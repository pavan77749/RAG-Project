import "dotenv/config";
import { embeddings } from "./embeddings.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Ollama } from "@langchain/ollama";

const run = async () => {
  const store = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: process.env.QDRANT_COLLECTION,
      checkCompatibility: false,
    }
  );

  const question = "what is the big data ?";
  const docs = await store.similaritySearch(question, 3);

  const context = docs.map(d => d.pageContent).join("\n\n");

  const llm = new Ollama({
    model: "llama3",
    temperature: 0.2,
  });

  const prompt = `
Answer ONLY using the context below.
If not found, say "Not found in document".

Context:
${context}

Question:
${question}

Answer:
`;

  const response = await llm.invoke(prompt);

  console.log("\n🧠 FINAL ANSWER:\n");
  console.log(response);
};

run();
