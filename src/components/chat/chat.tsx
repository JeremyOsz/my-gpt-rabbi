import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai"
import React, { useRef } from "react"
import { api } from "~/utils/api"

interface Conversation {
  role: string
  content: string
}

// UseQuery based on getChatCompletion
const useChatCompletion = (messages: ChatCompletionRequestMessage[]) => {
    return api.openai.getChatResponse.useQuery({ messages }, { enabled: !!messages && messages.length > 0 })
}

export default function Chat() {
  // States
  const [value, setValue] = React.useState<string>("")
  const [chatHistory, setChatHistory] = React.useState<ChatCompletionRequestMessage[]>([])
  const conversation = useChatCompletion(chatHistory)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setChatHistory([...chatHistory, { role: "user", content: value }])
    setValue("")
  }

  const handleRefresh = () => {
    console.log(conversation.data)
    inputRef.current?.focus()
    setValue("")
    setChatHistory([])
  }

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
          ></input>
          <button type="submit">Submit</button>
      </form>
      <div>
        RESULTS
        {
          conversation.data && conversation.data.map(({role, content}, index) => (
            <div className="rounded-sm bg-blue-200" key={index}>
              <p>{role}</p>
              <p>{content}</p>
            </div>
          ))
        }

      </div>
    </div>
  )
}