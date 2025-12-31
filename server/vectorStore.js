import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";

export const getQdrantStore = async () => {
  return await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: process.env.QDRANT_COLLECTION,
    }
  );
};
