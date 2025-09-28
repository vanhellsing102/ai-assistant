"use client";
import * as blazeface from "@tensorflow-models/blazeface";
import { useEffect, useRef, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { ThreeDot } from "react-loading-indicators";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

const page = () => {
    const [cameraOpen, setCameraOpen] = useState(false);
    const [mood, setMood] = useState("");
    const [advice, setAdvice] = useState("");
    const modelRef = useRef(null);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const intervalRef = useRef(null);

    // model load-----------------
    useEffect(() => {
    const loadModel = async () => {
        await tf.setBackend("webgl");
        await tf.ready();
        console.log("TensorFlow.js backend ready:", tf.getBackend());
        const model = await blazeface.load();
        modelRef.current = model;
        console.log("BlazeFace Model loaded ✅");
    };
    loadModel();
}, []);
useEffect(() => {
    if (modelRef.current && cameraOpen) {
        detectMood();
    }
}, [modelRef.current, cameraOpen]);

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
            setMood("");
            setAdvice("");
            console.log("Camera turned OFF");
        }
    }

    const detectMood = async () => {
    if (!modelRef.current) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
        if (videoRef.current) {
            const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
            if (predictions.length > 0) {
                const moods = ["happy", "sad", "angry", "neutral", "surprised"];
                const detectedMood = moods[Math.floor(Math.random() * moods.length)];
                setMood(detectedMood);
                giveAdvice(detectedMood);
            }
        }
    }, 3000);
};
if (intervalRef.current) {
    clearInterval(intervalRef.current);
}

    const giveAdvice = (mood) => {
        const moodAdvice = {
            happy: "তুমি আজ খুশি 🥰, এনার্জি নিয়ে কাজ চালিয়ে যাও!",
            sad: "তুমি কিছুটা দুঃখী 😔, একটু গান শোনো বা বাইরে হাঁটো।",
            angry: "তুমি রাগান্বিত 😠, গভীর শ্বাস নাও এবং শান্ত হও।",
            surprised: "তুমি অবাক 😲, কি হয়েছে বলো তো?",
            neutral: "তুমি শান্ত mood এ আছো 🙂, এগিয়ে যাও।",
        };
        setAdvice(moodAdvice[mood] || "আমি বুঝতে পারছি না তোমার মুড 😅");
    };
    console.log(advice, mood);
    return (
        <div className="flex items-center justify-center mt-20 md:mt-16">        
            <div className="flex flex-col items-center gap-5">
                <p className="font-semibold text-gray-700">Tap the camera icon for mood scan.</p>
                <button onClick={handleCamera} className={`bg-gray-400/20 p-3 cursor-pointer rounded-full mt-0 md:mt-8`}>
                    <BsCameraFill size={50}/>
                </button>
                <p className="text-red-700 font-semibold">{advice}</p>
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