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
  const [langName, setLangName] = useState("Bangla");
  const [langType, setLangType] = useState("bn-BD");

  // console.log(langType, langName);
  const toggleLang = () => {
    setLangType(langType === "bn-BD" ? "en-US" : "bn-BD");
    setLangName(langType === "bn-BD" ? "English" : "Bangla");
  };

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
    socket.emit("send_message", {text, langName, langType});
    e.target.reset();
  }
  // console.log(reply);

  const handleCopyText = async() =>{
    await navigator.clipboard.writeText(reply);
  }

  return (
    <div className="flex justify-center items-center flex-col gap-5 px-3 md:mt-0 mt-10">
      <div className="flex flex-row-reverse items-center gap-2 w-full justify-center mt-7 md:mt-16">
        
        <form
          onSubmit={handleText}
        className="relative flex justify-center md:w-[40%]"
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
        <div className="flex gap-1 items-center">
          <div
        onClick={toggleLang}
        className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${
          langType === "bn-BD" ? "bg-[#4FB7B3]" : "bg-[#637AB9]"
        }`}
      >
        <div
          className={`w-3 h-3 bg-white/70 rounded-full shadow-md transform transition ${
            langType === "bn-BD" ? "translate-x-0" : "translate-x-4"
          }`}
        ></div>
          </div>
          <span className="text-sm font-semibold">{langType === "bn-BD" ? "BN" : "EN"}</span>
        </div>
      </div>
      
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
