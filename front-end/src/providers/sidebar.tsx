import { Sidebar, SidebarBody, SidebarLink, SidebarLinkSkeleton } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { DotPattern } from "@/components/ui/dots-background";
import RenderIcon from "@/components/icons/render-Icon";
import { useQuery } from "@tanstack/react-query";
import { getChats, type ChatGroup, type Type } from "@/api/chat";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";


export function Layout({ children }: { children :React.ReactNode}) {
  const { data, isLoading,error } =  useQuery({
    queryKey: ["chats"],
    queryFn: getChats,

  });

  
  
  if (error) {
    toast.error("Failed to fetch chats", {
      description:
        // Try to access error.response.data.detail if available, otherwise fallback to error.message
        (error as any)?.response?.data?.detail || error.message || "An unknown error occurred",
    });
  }
  

  

  
  const [open, setOpen] = useState(false);
  return (
    <div className={" relative flex flex-col md:flex-row h-screen gap-4"}>
      <DotPattern
        className={
          "[mask-image:radial-gradient(650px_circle_at_center,white,transparent)]"
        }
      />

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 ">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {isLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <SidebarLinkSkeleton key={idx} />
                  ))
                : data &&
                  data.map((chat: ChatGroup) => (
                    <SidebarLink
                      key={chat.name}
                      link={chat.name}
                      icon={<RenderIcon type={chat?.metadata?.type as Type} />}
                      label={chat.name}
                      time={chat.metadata?.createdAt!}
                    />
                  ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
      <Toaster />
    </div>
  );
}


export const Logo = () => {
  return (
    <a
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary/90 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        ChatLoder
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
};

