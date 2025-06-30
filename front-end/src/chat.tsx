import { ChatForm } from "./components/ui/chat-form";
import { Layout } from "./providers/sidebar";
import { useParams } from "react-router-dom";
import TextAreaForm from "./components/ui/textarea-form";
import { useEffect, useRef, useState } from "react";
import { cn } from "./lib/utils";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import ChatAI from "./components/chat/chat-ai";
import ChatUsre from "./components/chat/chat-user";
import { useChatStorage } from "./lib/useChatStorage";

export default function ChatPage() {
  const [input, setInput] = useState({ text: "" });
  const { id } = useParams();
  const { messages, send, isLoading, isStreaming } = useChatStorage(id!);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.text.trim()) return;
    send(input.text);
    setInput({ text: "" });
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="overflow-y-auto h-full max-h-[calc(100vh-160px)] w-full p-4 space-y-4">
          {messages.map((chat, index) => (
            <div
              key={index}
              className={cn(
                "w-fit max-w-[80%] px-2 py-1 rounded-none whitespace-pre-wrap",
                chat.sender === "ai"
                  ? "ml-auto bg-primary text-white"
                  : "mr-auto bg-gray-200 text-black",
                chat.sender === "ai" && !chat.message && isStreaming
                  ? "min-h-[40px] min-w-[80px]"
                  : ""
              )}
            >
              {chat.sender === "ai" ? (
                <ChatAI
                  resources={chat.metadata?.resources || []}
                  isStreaming={isStreaming}
                  message={chat.message}
                  timestamp={chat.timestamp}
                />
              ) : (
                <ChatUsre timestamp={chat.timestamp} message={chat.message} />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && !isStreaming && (
            <div className="ml-auto px-4 py-2 text-sm text-white bg-primary rounded-xl w-fit flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          )}
        </div>

        <ChatForm>
          <div className="relative">
            <TextAreaForm
              value={input.text}
              setData={setInput}
              disabled={isLoading || isStreaming}
              handleKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex justify-end p-3 absolute top-1 right-0">
              <button
                type="submit"
                onClick={handleSend}
                className={cn(
                  "px-1.5 py-1.5 rounded-lg text-sm transition-colors border flex items-center gap-1",
                  input.text.trim()
                    ? "bg-primary text-black hover:bg-primary/90"
                    : "text-zinc-400 cursor-not-allowed"
                )}
                disabled={!input.text.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpIcon className="w-4 h-4" />
                )}
                <span className="sr-only">Send</span>
              </button>
            </div>
          </div>
        </ChatForm>
      </div>
    </Layout>
  );
}
