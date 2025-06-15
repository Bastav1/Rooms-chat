
interface BubbleProps{
    text:string
}

export function Bubble({text}:BubbleProps){
return <div className="text-black text-sm bg-[#fafafa] w-fit rounded-md p-2 max-w-24">
   {text}
</div>
}