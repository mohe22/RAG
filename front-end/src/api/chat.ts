import axiosClient from "@/lib/axios-client";




interface ChatGroupCreatePayload {
  source: string; 
}



export type Type = "pdf" | "url" | "txt" | "csv" | "json";


export interface ChatGroup {
  name: string;
  metadata: {
    createdAt: string;
    type: Type;
  } | null;

}
export const getChats = async (): Promise<ChatGroup[]> => {
  const res = await axiosClient.get("/chat/all-chats");
  return res.data;
};

export const createChatGroup = async (
  data: ChatGroupCreatePayload
) => {
  const res = await axiosClient.post("/chat/new-chat/", data);
  return res.data;
};


export const sendMessage = async (
  id: string,
  message: string,
  history: {}[],
  onChunk: (chunk: string) => void
) => {
  const res = await fetch(`http://localhost:8000/chat/message/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) throw new Error("No response stream from server");
  if (res.status == 404) {
    // window.location.href = "/"
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};
export const deleteChatGroup = async (chatId: string) => {
  const res = await axiosClient.delete(`/chat/${chatId}`);
  return res.data;
};
