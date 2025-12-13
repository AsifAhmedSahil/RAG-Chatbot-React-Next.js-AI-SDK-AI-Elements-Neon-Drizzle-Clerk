import { streamText, UIMessage, convertToModelMessages, tool, InferUITool, InferUITools, UIDataTypes, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";

const tools = {
  searchKnoledgeBase: tool({
    description: "Search the knoledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("the search query to find relevant documents"),
    }),
    execute: async({query}) => {
        try {
            const results = await searchDocuments(query,3,0.5)

            if(results.length === 0){
                return "No relevant information found in the knoledge base";
            }

            const formattedResult = results.map((r,i)=> `[${i+1}] ${r.content}`).join("\n\n")

            return formattedResult
            
        } catch (error) {
            console.error("Search error",error);
            return "Error searching the knoledge base";
            
        }
    }
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes,ChatTools>

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1-mini"),
      messages: convertToModelMessages(messages),
      tools,
      system:`you are a helpful assistant with access to a knoledge base. when users ask qiuestions, search the knoledge base fo relevant information,Always search before answering if the question might relate to uploaded documents.Base your answer on the search results when avaiable. Give concise answers that correctly answer what the user is asking for. Do not flood them with all information from the search results `,
      stopWhen: stepCountIs(2)
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
