
import { Loader2, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import materialDark from "react-syntax-highlighter/dist/esm/styles/prism/material-dark";
import remarkGfm from "remark-gfm";

interface ChatAIProps {
  message: string;
  isStreaming: boolean;
  resources: string[];
  timestamp: string;
}

function ChatAI({ message, isStreaming, resources, timestamp }: ChatAIProps) {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prose prose-invert max-w-none overflow-x-scroll text-white cursor-pointer relative group">
      {message ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <div className="relative">
                  <SyntaxHighlighter
                    language={match[1]}
                    // @ts-ignore
                    style={materialDark}
                    PreTag="div"
                    showLineNumbers
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));
                    }}
                    className="absolute top-2 right-2 w-6 h-6 text-muted-foreground bg-gray-800/80"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <code className=" rounded px-1.5 py-0.5 text-sm font-mono">
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return <div className="not-prose">{children}</div>;
            },
            table({ children }) {
              return (
                <div className="overflow-auto">
                  <table className="border-collapse border  w-full">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="border border-gray-600 px-4 py-2 text-left bg-background  font-semibold">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="border border-gray-600 px-4 py-2">{children}</td>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic  py-2 rounded-r-lg my-1">
                  {children}
                </blockquote>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-medium"
                >
                  {children}
                </a>
              );
            },
            p({ children }) {
              return <p className="my-1 leading-relaxed">{children}</p>;
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-6  ">{children}</ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-6">{children}</ol>
              );
            },
            li({ children }) {
              return <li className="pl-2">{children}</li>;
            },
            h1({ children }) {
              return (
                <h1 className="text-2xl font-bold  pb-2 border-b border-gray-700">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold my-3">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-bold my-2">{children}</h3>;
            },
          }}
        >
          {message}
        </ReactMarkdown>
      ) : isStreaming ? (
        <div className="flex items-center gap-2 ">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing your request...</span>
        </div>
      ) : null}

      <div className=" flex flex-row items-center justify-between">
        <div className="text-sm mt-2 mb-1 flex  items-center  gap-x-3">
          <span>🕐 {formattedTime}</span>
          {resources.length > 0 && (
            <span className="text-green-400 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {resources.length}
            </span>
          )}
        </div>
        {message && (
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="w-6 h-6 text-muted-foreground bg-gray-800/50"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatAI;
