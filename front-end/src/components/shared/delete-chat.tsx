import {   X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteChatGroup } from "@/api/chat";
import { useChatStorage } from "@/lib/useChatStorage";

function DeleteChat({ id }: { id: string }) {
  const { clearStorage } = useChatStorage(id);

  const { mutate: deleteChat, isPending } = useMutation({
    mutationFn: () => deleteChatGroup(id),
    onSuccess: () => {
      clearStorage()
    },
    onError: (error) => {
      console.error("Failed to delete chat group:", error);
    },
  });

  return (
    <button
  
      onClick={() => deleteChat()}
      disabled={isPending}
      className=" rounded-none absolute -top-6 right-1 hover:text-white cursor-pointer  opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="w-5 h-5" />
    </button>
  );
}

export default DeleteChat;
  