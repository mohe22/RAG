import type { SVGProps } from "react";

export function Csv(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      {/* Icon from Catppuccin Icons by Catppuccin - https://github.com/catppuccin/vscode-icons/blob/main/LICENSE */}
      <path
        fill="none"
        stroke="#a6da95"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.5 3.5c0-.54.48-1 1.08-1H6.5l1.54 1h5.38c.6 0 1.08.44 1.08.98l-.09 9.04c0 .54-.48.98-1.08.98H2.58c-.6 0-1.08-.44-1.08-.98zm2 4v4m3-4v4m3-4v4m3-4v4m-9 0h9m-9-2h9m-9-2h9"
      />
    </svg>
  );
}
