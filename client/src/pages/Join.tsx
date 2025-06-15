import { useNavigate } from "react-router-dom";
import { Chats } from "../icons/chat";
import { useEffect, useRef, useState } from "react";
import { Lower } from "../components/lower";

export function Join() {
  const navigate = useNavigate();
  const input1Ref = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState("");
  const [lowerpart, setLowerpart] = useState(false);
  const input2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "room-created") {
        const roomId = data.payload.roomId;
        localStorage.setItem("roomId", roomId);
        setRoomId(roomId);
        setLowerpart(true);
      }

      if (data.success === "true") {
        navigate("/rooms");
      }

      if (data.success === "false") {
        alert("No room with that ID exists.");
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  function createFunc() {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "create" }));
    }
  }

  function joinFunc() {
    const roomId = input2Ref.current?.value?.trim();
    const username = input1Ref.current?.value?.trim();

    if (!roomId || !username) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    }
  }

  return (
    <div>
      <div className="bg-black font-custom top-0 left-0 min-h-screen min-w-screen flex justify-center items-center text-white">
        <div className="border border-gray-700  h-fit w-[40vw] rounded-lg">
          <div className="p-5 ">
            <div className="flex items-center">
              <Chats />
              <div className="text-2xl font-semibold ml-2">Real Time Chat</div>
            </div>
            <div className="text-gray-400 text-sm mt-2">
              temporary room that expires after all users exit
            </div>
            <button
              onClick={createFunc}
              className="bg-[#fafafa] w-full text-black mt-6 py-2 rounded-md font-semibold text-lg cursor-pointer"
            >
              {" "}
              Create New Room
            </button>
            <input
              ref={input1Ref}
              className="bg-black border border-gray-800 w-full text-white mt-4 py-2 px-2 rounded text-sm"
              placeholder="Enter your name"
              type="text"
            ></input>
            <div className="flex mt-3 text-sm">
              <input
                ref={input2Ref}
                className="px-2 py-2 w-[50vw] rounded-md border  bg-black border-gray-700  "
                placeholder="Enter Room Code"
              ></input>
              <button
                onClick={joinFunc}
                className="bg-[#fafafa] px-6 max-h-10 flex items-center text-gray-800 justify-center font-semibold rounded-md ml-2 cursor-pointer"
              >
                {" "}
                Join Room
              </button>
            </div>
            {lowerpart && <Lower roomId={roomId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
