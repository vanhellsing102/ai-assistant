"use client";
import { useRef, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { ThreeDot } from "react-loading-indicators";

const page = () => {
    const [cameraOpen, setCameraOpen] = useState(false);
    const streamRef = useRef(null);
    const videoRef = useRef(null);

    const handleCamera = async() =>{
        if(!cameraOpen){
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                streamRef.current = stream;
                setCameraOpen(true);
                setTimeout( () =>{
                    if(videoRef.current){
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
                }, 100)
                
                console.log("Camera turn on");
            } catch (error) {
                console.error("Camera access denied", error);
            }
        } else{
            if(streamRef.current && typeof streamRef.current.getTracks === "function"){
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            streamRef.current = null;
            setCameraOpen(false);
            console.log("Camera turned OFF");
        }
    }
    return (
        <div className="flex items-center justify-center mt-20 md:mt-16">        
            <div className="flex flex-col items-center gap-5">
                <p className="font-semibold text-gray-700">Tap the camera icon for mood scan.</p>
                <button onClick={handleCamera} className={`bg-gray-400/20 p-3 cursor-pointer rounded-full mt-0 md:mt-8`}>
                    <BsCameraFill size={50}/>
                </button>
                {
                    cameraOpen && <video ref={videoRef} muted autoPlay className="h-52 w-full border border-red-600 object-cover"></video>
                }
                <div>{cameraOpen ? 
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