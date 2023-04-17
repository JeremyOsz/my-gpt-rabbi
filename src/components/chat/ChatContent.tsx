import { Avatar } from "./Avatar";
import clsx from "clsx";
import { type Author } from "../../utils/types";
import ReactMarkdown from "react-markdown";

export type ChatItem = {
  author: Author;
  content: string;
  isError?: boolean;
};

export 

type Props = {
  chatItems: ChatItem[];
};

export const ChatContent = ({ chatItems }: Props) => (
  <>
    {chatItems.map((chatItem, index) => (
      <div
        key={index}
        className={clsx("py-4", {
          "bg-blue-500": chatItem.author === "User",
          "bg-blue-400": chatItem.author === "AI",
          "pb-16": index === chatItems.length - 1,
        })}
      >
        <div className="container mx-auto flex max-w-3xl">
          <div>
            <Avatar author={chatItem.author} />
          </div>

          <div
            className={clsx("ml-5 mt-1 box-border", {
              "text-white": !chatItem.isError,
              "text-red-500": chatItem.isError,
            })}
          >
            <ReactMarkdown>{chatItem.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    ))}
  </>
);
