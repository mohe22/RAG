interface ChatUserProps {
  message: string;
  timestamp: string;
}

function ChatUser({ message, timestamp }: ChatUserProps) {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <p className="">{message}</p>
      <div className="text-xs text-muted-foreground mb-1">
        <span>🕐 {formattedTime}</span>
      </div>
    </div>
  );
}

export default ChatUser;
