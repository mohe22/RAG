import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getExt(filename: string): "pdf" | "csv" | "json" | "url" {
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return "url";
  }

  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || ext === "csv" || ext === "json") {
    return ext;
  }

  return "url";
}
