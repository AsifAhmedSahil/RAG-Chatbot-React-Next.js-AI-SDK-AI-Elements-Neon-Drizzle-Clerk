'use server'
import { chunkContent } from "@/lib/chunking";
import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embeddings";
import pdf from "pdf-parse"
import { success } from "zod/v4";

export async function processPdfFile(formData:FormData) {
    try {
        const file = formData.get("pdf") as File;

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes);
        const data = await pdf(buffer)

        if(!data.text || data.text.trim().length === 0){
            return {
                success: false,
                error:"No Text Found in PDF"
            }
        }

        const chunks = await chunkContent(data.text)
        const embeddings = await generateEmbeddings(chunks)

        const records = chunks.map((chunk,index) => ({
            content:chunk,
            embedding: embeddings[index],
        }))

        await db.insert(documents).values(records)

        return {
            success:true,
            message: `Created ${records.length} searchable Chunks`
        }

    } catch (error) {
        console.error("PDF processing error",error);

        return {
            success:false,
            error: "Failed to process PDF"
        }
        
    }
}