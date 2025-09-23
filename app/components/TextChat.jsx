"use client";
import { MdSend } from "react-icons/md";

const TextChat = () => {
    const handleText = e =>{
        e.preventDefault();
        const form = new FormData(e.target);
        const text = form.get("text");
        console.log(text);
    }
  return (
    <div className="flex justify-center items-center flex-col gap-5 px-3 md:mt-0 mt-10">
      <form onSubmit={handleText} className="relative flex justify-center mt-7 md:mt-16 w-full md:w-[40%]">
        <input
          type="text"
          placeholder="Type your message..."
          name="text"
          className="w-full pr-10 py-2 px-3 border-2 border-[#4FB7B3] rounded-sm outline-none text-gray-100 placeholder-gray-300 bg-[#637AB9]"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
        >
          <MdSend size={20} />
        </button>
      </form>
      <p
      disabled
  placeholder="Write your message..."
  className="w-full md:w-[50%] h-[250px] p-4 rounded-sm bg-white/30 border border-[#4FB7B3] shadow-sm text-blakc placeholder-gray-400 overflow-y-auto"
></p>
    </div>
  );
};

export default TextChat;
