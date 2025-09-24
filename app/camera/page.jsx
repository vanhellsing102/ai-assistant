"use client";
import { useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { ThreeDot } from "react-loading-indicators";

const page = () => {
    const [listening, setListening] = useState(false);
    return (
        <div className="flex items-center justify-center mt-20 md:mt-32">        
            <div className="flex flex-col items-center gap-5">
                <p className="font-semibold text-gray-700">Tap the voice icon for video communication.</p>
                <button className={`bg-gray-400/20 p-3 cursor-pointer rounded-full mt-0 md:mt-16`}>
                    <BsCameraFill size={50}/>
                </button>
                <div>{listening ? 
                <ThreeDot variant="bounce" color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} size="small" text="" textColor="" />
                 : 
                 <p className="font-semibold text-2xl text-slate-500">Start video...</p>
                 }
                 </div>
            </div>
        </div>
    );
};

export default page;