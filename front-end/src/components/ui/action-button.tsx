import { useRef, useState, type ReactNode } from "react";
import { Button } from "./button";
import { getExt } from "@/lib/utils";

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  mode: "file" | "url";
  onFileSelect?: (file: File | null) => void;
  onUrlSubmit?: (url: string) => void;
};

export default function ActionButton({
  icon,
  label,
  mode,
  onFileSelect,
  onUrlSubmit,
}: ActionButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleClick = () => {
    if (mode === "file") {
      fileInputRef.current?.click();
    } else if (mode === "url") {
      if (!showInput) {
        setShowInput(true);
        return;
      }
      if (onUrlSubmit && url) {
        onUrlSubmit(url);
        setUrl("");
        setShowInput(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect?.(file);
  };

  return (
    <div className="flex items-center gap-3">
      {mode === "file" && (
        <input
          type="file"
          ref={fileInputRef}
          accept={`.${getExt(label)}`}
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      {mode === "url" && showInput && (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="px-4 py-2 text-sm rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 hover:shadow-sm"
        />
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:bg-muted"
      >
        {icon}
        <span className="text-xs">{label}</span>
      </Button>
    </div>
  );
}
