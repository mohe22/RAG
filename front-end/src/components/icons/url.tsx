import type { SVGProps } from "react";

export function Url(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      {/* Icon from Catppuccin Icons by Catppuccin - https://github.com/catppuccin/vscode-icons/blob/main/LICENSE */}
      <g
        fill="none"
        stroke="#8aadf4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 8A6.5 6.5 0 0 1 8 14.5A6.5 6.5 0 0 1 1.5 8A6.5 6.5 0 0 1 8 1.5A6.5 6.5 0 0 1 14.5 8" />
        <path d="M8 1.5c1.67 2 2.5 4.17 2.5 6.5s-.83 4.5-2.5 6.5m0-13A9.96 9.96 0 0 0 5.5 8c0 2.33.83 4.5 2.5 6.5m-5.5-4h11m-11-5h11" />
      </g>
    </svg>
  );
}
