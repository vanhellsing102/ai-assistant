"use client";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { Atom, OrbitProgress } from "react-loading-indicators";
import ReactMarkdown from "react-markdown";
import { GoCopy } from "react-icons/go";
import socket from "../socket.js";

const TextChat = () => {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() =>{
    socket.on("receive_message", (data) =>{
      setReply(data?.reply || "No reply");
      setLoading(false);
    })
    return () =>{
      socket.off("receive_message");
    }
  }, [])

  const handleText = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const text = form.get("text");
    setLoading(true);
    setReply("");
    socket.emit("send_message", {text, lang: "bn"});
    e.target.reset();
  }
  // console.log(reply);

  const handleCopyText = async() =>{
    await navigator.clipboard.writeText(reply);
  }
  return (
    <div className="flex justify-center items-center flex-col gap-5 px-3 md:mt-0 mt-10">
      <form
        onSubmit={handleText}
        className="relative flex justify-center mt-7 md:mt-16 w-full md:w-[40%]"
      >
        <input
          type="text"
          placeholder="Type your message..."
          name="text"
          required
          className="w-full pr-10 py-2 px-3 border-2 border-[#4FB7B3] rounded-sm outline-none bg-white/30"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          {loading ? (
            <div className="flex justify-end w-full" style={{ transform: "scale(0.3)" }}>
              <OrbitProgress variant="track-disc" color="#327fcd" speedPlus="3" easing="linear" />
            </div>
          ) : (
            <MdSend size={20} />
          )}
        </button>
      </form>
      <div
        disabled
        placeholder="Write your message..."
        className={`w-full md:w-[50%] h-[250px] p-4 rounded-sm bg-white/30 border border-[#4FB7B3] shadow-sm text-blakc placeholder-gray-400 overflow-y-auto ${
          !reply ? "flex items-center justify-center" : ""
        } relative group`}
      >
        {loading ? (
          <Atom color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} size="medium" text="" textColor="" />
        ) : (
          <ReactMarkdown>{reply}</ReactMarkdown>
        )}
        <button onClick={handleCopyText} className={`absolute ${reply ? "block" : "hidden"} -top-10 overflow-hidden group-hover:top-2 group-hover:right-2 cursor-pointer bg-gray-400/20 p-1 rounded-md`}>
            <GoCopy className="hover:scale-105 transition-all duration-500"></GoCopy>
        </button>
      </div>
    </div>
  );
};

export default TextChat;
