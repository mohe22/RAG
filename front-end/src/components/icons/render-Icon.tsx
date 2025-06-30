import type { Type } from "@/api/chat";
import { Csv } from "./csv";
import Json from "./json";
import { PDF } from "./pdf";
import { Url } from "./url";

const RenderIcon = ({ type }: { type: Type }) => {
  switch (type) {
    case "pdf":
      return <PDF className="w-5 h-5" />;
    case "csv":
      return <Csv className="w-5 h-5" />;
    case "url":
      return <Url className="w-5 h-5" />;
    case "json":
      return <Json className="w-5 h-5" />;
    default:
      return <Url className="w-5 h-5" />;
  }
};

export default RenderIcon;
