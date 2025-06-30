
import React from "react";

export function ChatForm({

  children,
}: {
  children:React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
