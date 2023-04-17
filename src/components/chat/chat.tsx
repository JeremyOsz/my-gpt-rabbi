import React, { type FunctionComponent, useRef, useState } from "react"
import { api } from "~/utils/api"
import { ChatContent, type ChatItem } from "./ChatContent"
import { ChatInput } from "./ChatInput"

export type Conversation = {
  role: string
  content: string
}



export const Chat: FunctionComponent = () => {
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  const scrollToRef = useRef<HTMLDivElement>(null);

  const generatedTextMutation = api.openai.generateText.useMutation({
    onSuccess: (data) => {
      setChatItems([
        ...chatItems,
        {
          content: data.generatedText,
          author: "AI",
        },
      ]);
    },

    onError: (error) => {
      setChatItems([
        ...chatItems,
        {
          content: error.message ?? "An error occurred",
          author: "AI",
          isError: true,
        },
      ]);
    },

    onSettled: () => {
      setWaiting(false);
    },
  });

  const resetMutation = api.openai.reset.useMutation();

  const handleUpdate = (prompt: string) => {
    setWaiting(true);

    setChatItems([
      ...chatItems,
      {
        content: prompt.replace(/\n/g, "\n\n"),
        author: "User",
      },
    ]);

    generatedTextMutation.mutate({ prompt });
  };

  const handleReset = () => {
    setChatItems([]);
    resetMutation.mutate();
  };
  return (
    <div className='w-full rounded-xl overflow-clip'>
      <section className="w-full flex-grow overflow-y-scroll">
          <ChatContent chatItems={chatItems} />
          <div ref={scrollToRef} />
        </section>

        <section className="w-full">
          <ChatInput
            onUpdate={handleUpdate}
            onReset={handleReset}
            waiting={waiting}
          />
        </section>
    </div>
  )
}