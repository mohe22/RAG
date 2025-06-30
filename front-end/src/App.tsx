import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Layout } from "./providers/sidebar";
import { ChatForm } from "./components/ui/chat-form";
import RenderIcon from "./components/icons/render-Icon";
import ActionButton from "./components/ui/action-button";
import { createChatGroup } from "./api/chat";
import { toast } from "sonner";
import { Spinner } from "./components/ui/Loader";
function App() {
  const navigate = useNavigate();

  const {mutate,isPending} = useMutation({
    mutationFn: createChatGroup,
    onSuccess: (res) => {
      navigate(`/chat/${res}`);
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.detail || error.message || "Unexpected error";
        toast.error("Failed to create chat group", {
          description: errMsg,
        });
    },
  });

  if (isPending){
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner/>
      </div>
    )
  }



  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 space-y-6">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Load it. Ask it. Learn.
        </h1>

        <ChatForm >
          <div className="flex items-center justify-center gap-3 mt-4">
            {["pdf", "json", "csv"].map((type) => (
              <ActionButton
                key={type}
                mode="file"
                icon={<RenderIcon type={type as any} />}
                label={type.toUpperCase()}
                onFileSelect={(file) => {
                  if (file) {
                    mutate({ source: file.name });
                  }
                }}
              />
            ))}
            <ActionButton
              mode="url"
              icon={<RenderIcon type="url" />}
              label="URL"
              onUrlSubmit={(url) => {
                if (url) {
                  mutate({ source: url });
                }
              }}
            />
          </div>
        </ChatForm>
      </div>
    </Layout>
  );
}

export default App;
