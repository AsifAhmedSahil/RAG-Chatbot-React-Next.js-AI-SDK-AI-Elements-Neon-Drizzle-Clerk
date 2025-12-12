import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleFileUpload = async(e:React.ChangeEvent<HTMLInputElement>) =>{
    

  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          PDF Upload
        </h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label htmlFor="pdf-upload">Upload PDF Files</Label>

              <Input 
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="mt-2"
              />

              {
                isLoading && (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                        <span className="text-muted-foreground">Processing PDF...</span>


                    </div>
                )
              }

              {
                message && (
                    <Alert variant={message.type === "error" ? "destructive" : "default"}>
                        <AlertTitle >
                            {message.type === "error" ? "Error!":"Success"}
                        </AlertTitle>
                            <AlertDescription>
                                {message.text}

                            </AlertDescription>
                    </Alert>
                )
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
