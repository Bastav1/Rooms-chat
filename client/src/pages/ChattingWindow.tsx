import { useEffect, useRef, useState } from "react";
import { Chats } from "../icons/chat";
import { Copy } from "../icons/copy";
import { Bubble } from "../components/bubble";

function ChattingWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [numberOfUser, setNumberOfUsers] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const roomId = localStorage.getItem("roomId");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "chat") {
        setMessages((m) => [...m, data.payload.message]);
      }
      if (data.type === "user-count") {
        setNumberOfUsers(data.payload.count);
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const input = inputRef.current?.value.trim();
    if (!input || wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: input,
        },
      })
    );
   inputRef.current!.value = "";
  }

  function copyCode() {
    const roomId = localStorage.getItem("roomId");
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    } else {
      return;
    }
  }

  return (
    <div>
      <div className="bg-black font-custom top-0 left-0 min-h-screen min-w-screen flex justify-center items-center text-white">
        <div className="border border-gray-800 h-screen w-[40vw] rounded-md">
          <div className="p-5 ">
            <div className="flex items-center">
              <Chats />
              <div className="text-2xl font-semibold ml-2">Real Time Chat</div>
            </div>
            <div className="text-gray-400 text-sm mt-2">
              temporary room that expires after all users exit
            </div>
            <div className="px-2 text-gray-400 w-full bg-[#262626] rounded-md mt-6 py-4 flex justify-between text-sm items-center">
              <div className="flex items-center">
                <div> Room Code: {roomId}</div>
                <div onClick={copyCode} className="ml-2">
                  <Copy />
                </div>
              </div>
              <div>Users:{numberOfUser}</div>
            </div>

            {/* main part... */}
            <div className="border border-gray-800 mt-6 rounded h-[65vh] flex-vertical overflow-y-auto my-2">
              <div className="flex-1 overflow-y-auto my-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="bg-black-600 p-2 rounded flex justify-end"
                  >
                    <Bubble text={msg} />
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>

            <div className="flex  mt-3 text-sm">
              <input
                ref={inputRef}
                className="px-2 py-2 w-[50vw] rounded-md border  bg-black border-gray-00  "
                placeholder="Type a message..."
              ></input>
              <button
                className="bg-[#fafafa]  px-6 max-h-10 flex items-center text-black justify-center font-semibold rounded-md ml-2"
                onClick={sendMessage}
              >
                {" "}
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChattingWindow;

// on messages are handles by a single useEffect(empty dependency array func)...
// while the sends are sent in the respective function of needs
