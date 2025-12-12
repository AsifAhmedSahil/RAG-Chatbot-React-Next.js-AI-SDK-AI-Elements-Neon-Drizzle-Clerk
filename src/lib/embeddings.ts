import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

export async function generateEmbedding(text: string) {
  const input = text.replace("\n", " ");

  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: input,
  });

  return embedding;
}

// for processing pdf - embedded many

export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((text)=> text.replace("\n", " "));

  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    values: inputs,
  });

  return embeddings;
}


