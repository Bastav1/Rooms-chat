import { Copy } from "../icons/copy";

interface LowerProps {
  roomId: string;
}
export function Lower({ roomId }: LowerProps) {
  function copyFunc() {
    navigator.clipboard.writeText(roomId);
  }
  return (
    <div className="w-full h-20 mt-3 justify-center align-center bg-[#262626] rounded-lg">
      <div className="text-sm text-gray-400 mt-4 flex justify-center">
        <div className="mt-2">Share this code with your friend</div>
      </div>
      <div className="flex align-center justify-center mt-4">
        <div className=" text-2xl mr-2">{roomId} </div>
        <div className="text-white mt-2" onClick={copyFunc}>
          <Copy />
        </div>
      </div>
    </div>
  );
}
