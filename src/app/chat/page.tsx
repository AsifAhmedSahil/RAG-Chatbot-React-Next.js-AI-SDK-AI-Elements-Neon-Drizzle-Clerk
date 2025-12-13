"use client";
import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Loader } from "@/components/ai-elements/loader";

export default function RAGChatBot() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;
    sendMessage({ text: message.text });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Conversation scroll area */}
      <div className="flex-1 overflow-y-auto mb-4">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}
                        
                        >
                          <MessageContent>
                            
                            {part.text}
                          </MessageContent>
                        </Message>
                      </Fragment>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
            {(status === "submitted" || status === "streaming") && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {/* Input area */}
      <PromptInput onSubmit={handleSubmit} className="mt-2">
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </PromptInputBody>
        <div className="flex items-center justify-between mt-2">
          <PromptInputTools />
          <PromptInputSubmit />
        </div>
      </PromptInput>
    </div>
  );
}
