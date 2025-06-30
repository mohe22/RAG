import { useEffect, useState } from "react";
import { sendMessage } from "../api/chat";

export interface ChatMessage {
  sender: "user" | "ai";
  message: string;
  timestamp: string;
  metadata?: {
    resources?: string[];
  };
}

export function useChatStorage(chatId: string) {
  const storageKey = `chat-${chatId}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const clearStorage = () => {
    localStorage.removeItem(storageKey);
    setMessages([]);
    window.location.href = "/"
  };
  
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse chat history", err);
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (!isStreaming) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const send = async (text: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    const timestamp = new Date().toISOString();

    const newUserMsg: ChatMessage = {
      sender: "user",
      message: userText,
      timestamp,
    };

    const newAIMessage: ChatMessage = {
      sender: "ai",
      message: "",
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMsg, newAIMessage]);
    setIsLoading(true);
    setIsStreaming(true);

    let aiResponse = "";
    let aiIndex: number;

    setMessages((prev) => {
      aiIndex = prev.length;
      return [...prev.slice(0, -1), newAIMessage];
    });

    try {
      const history =messages.slice(-3)

      await sendMessage(chatId, userText, history, (chunk: string) => {
        aiResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[aiIndex - 1] = {
            ...newMessages[aiIndex - 1],
            message: aiResponse,
          };
          return newMessages;
        });
      });

      const sourceMatch = aiResponse.match(/\[SOURCE\](.*)/s);
      const sources = sourceMatch
        ? sourceMatch[1]
            .trim()
            .split(",")
            .map((s) => s.trim())
        : undefined;

      const cleanMessage = sourceMatch
        ? aiResponse.replace(/\n*\[SOURCE\].*/s, "").trim()
        : aiResponse;

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[aiIndex - 1] = {
          sender: "ai",
          message: cleanMessage,
          timestamp: new Date().toISOString(),
          metadata: sources ? { resources: sources } : undefined,
        };
        return newMessages;
      });
    } catch (err: any) {
      
      if (err?.response?.status === 404) {
        // window.location.href = "/";
        return;
      }
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[aiIndex - 1] = {
          sender: "ai",
          message: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return { messages, send, isLoading, isStreaming, clearStorage };
}
