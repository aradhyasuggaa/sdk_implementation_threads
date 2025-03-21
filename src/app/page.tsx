"use client";
import { useState } from "react";
import { ClientMessage } from "./actions";
import { useActions } from "ai/rsc";
import { Message, continueConversation } from "./streamComponent";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const { submitMessage } = useActions();
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleSubmission = async () => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: "123",
        status: "user.message.created",
        text: input,
        gui: null,
      },
    ]);

    const response = await submitMessage(input);
    setMessages((currentMessages) => [...currentMessages, response]);
    setInput("");
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-row gap-2 p-2 bg-zinc-100">
          <input
            className="w-20 h-20 p-2 border-2 border-black rounded-md shadow-md"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmission();
              }
            }}
          />
          <button
            className="p-4 h-8 w-8 bg-blue-900 text-zinc-100 rounded-md"
            onClick={handleSubmission}
          >
            Send
          </button>
        </div>

        <div className="flex flex-col h-[calc(100dvh-56px)] overflow-y-scroll">
          <div>
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex flex-col gap-1 border-b p-2"
              >
                <div className="flex flex-row justify-between">
                  <div className="text-sm text-zinc-500">{message.status}</div>
                </div>
                <div className="flex flex-col gap-2">{message.gui}</div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="p-12">
          <div>
            {conversation.map((message, index) => (
              <div key={index}>
                {message.role}: {message.content}
                {message.display}
              </div>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
            <button
              onClick={async () => {
                const { messages } = await continueConversation([
                  ...conversation.map(({ role, content }) => ({
                    role,
                    content,
                  })),
                  { role: "user", content: input },
                ]);

                setConversation(messages);
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
