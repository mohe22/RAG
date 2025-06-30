import type { SVGProps } from "react";

export default function Json(props: SVGProps<SVGSVGElement>) {
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
        stroke="#eed49f"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 2.5H4c-.75 0-1.5.75-1.5 1.5v2c0 1.1-1 2-1.83 2c.83 0 1.83.9 1.83 2v2c0 .75.75 1.5 1.5 1.5h.5m7-11h.5c.75 0 1.5.75 1.5 1.5v2c0 1.1 1 2 1.83 2c-.83 0-1.83.9-1.83 2v2c0 .74-.75 1.5-1.5 1.5h-.5m-6.5-3a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m3 0a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m3 0a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"
      />
    </svg>
  );
}
