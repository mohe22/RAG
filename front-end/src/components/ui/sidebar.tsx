

import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { LinkProps } from "react-router-dom";
import { Skeleton } from "./skeleton";
import { formatDistanceToNow } from "date-fns";
import DeleteChat from "../shared/delete-chat";
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export function SidebarLinkSkeleton() {
  return (
    <div
      className={cn(
        "flex items-center hover:bg-primary/40 transition-colors justify-start gap-2 group/sidebar py-2",
      )}
    >
      <div className="pl-1">
        <Skeleton className="h-5 w-5 rounded-sm" />
      </div>
      <div className="flex flex-col space-y-1">
        <motion.span
          animate={{
            display: "inline-block",
            opacity: 1,
          }}
          className="group-hover/sidebar:translate-x-1 transition duration-150"
        >
          <Skeleton className="h-4 w-20" />
        </motion.span>
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  );
}



export const SidebarLink = ({
  link,
  className,
  icon,
  label,
  time,
  ...props
}: {
  link: string;
  icon: React.ReactNode;
  label: string;
  time: string;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const formattedTime =
    time && !isNaN(new Date(time).getTime())
      ? formatDistanceToNow(new Date(time), { addSuffix: true })
      : "Unknown time";
  return (
    <div className="gap-y-2 flex flex-col group relative w-full">
      <a
        href={"/chat/" + link}
        className={cn(
          "flex items-center  hover:bg-primary/40 transition-colors justify-start gap-2 group/sidebar py-2",
          className
        )}
        {...props}
      >
        <div className="pl-1">{icon}</div>
        <div className="flex flex-col">
          <motion.span
            animate={{
              display: animate
                ? open
                  ? "inline-block"
                  : "none"
                : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
          >
            {label}
          </motion.span>
          <motion.span
            animate={{
              display: animate
                ? open
                  ? "inline-block"
                  : "none"
                : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="text-xs text-muted-foreground"
          >
            {formattedTime}
          </motion.span>
        </div>
      </a>
      <DeleteChat id={label} />
    </div>
  );
};