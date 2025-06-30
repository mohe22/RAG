import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
type TextAreaFormProps = {
  value: string;
  setData: React.Dispatch<React.SetStateAction<{ text: string }>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled:boolean
};

function TextAreaForm({
  value,
  setData,
  handleKeyDown,
  disabled=false,
}: TextAreaFormProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) =>
        setData((prev) => ({
          ...prev,
          text: e.target.value,
        }))
      }
      disabled={disabled}
      onKeyDown={handleKeyDown}
      placeholder="ask."
      className={cn(
        "w-full px-4 py-3 resize-none bg-transparent border-none text-white text-sm",
        "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        "placeholder:text-neutral-500 placeholder:text-sm min-h-[70px]"
      )}
      style={{ overflow: "hidden" }}
    />
  );
}

export default TextAreaForm;
