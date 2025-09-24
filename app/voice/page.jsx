"use client"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardVoice } from "react-icons/md";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import "../styles/voice.css";
import { ThreeDot } from "react-loading-indicators";

const page = () => {
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [reply, setReply] = useState("");
    const [micOn, setMicOn] = useState(false);
    const timeoutRef = useRef(null);
    const [voices, setVoices] = useState([]);

    const handleVoice = async() =>{
        if(!micOn){
            SpeechRecognition.startListening({continuous: true, language: "bn-BD"});
            setMicOn(true);
        }
        else{
            setMicOn(false);
            SpeechRecognition.stopListening();
        }
    }

    useEffect( () =>{
        if(transcript && transcript.trim().length > 0){
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(async() =>{
                const text = transcript;
                resetTranscript();
                try {
                    axios.post('/api/chat', {text, lang: "hi"})
                    .then(res =>{
                        setReply(res?.data?.reply || "Sorry, I didn’t understand.");
                        // console.log(res?.data?.reply);
                    })
                    .catch(err =>{
                        console.log(err);
                    })
                } catch (error) {
                    console.log(error);
                }
            }, 3000)
        }
    }, [transcript, resetTranscript])
    
  useEffect(() => {
    let v = window.speechSynthesis.getVoices();
    if (v.length > 0) {
      setVoices(v);
    }
    window.speechSynthesis.onvoiceschanged = () => {
      v = window.speechSynthesis.getVoices();
      setVoices(v);
    //   console.log("Loaded voices:", v);
    };
  }, []);
  useEffect(() =>{
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.voice = voices.find((v) => v.lang === "hi-IN") || voices[0] || null;

    utterance.pitch = 1;
    utterance.rate = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [reply, voices])


    return (
        <div className="flex items-center justify-center mt-20 md:mt-32">        
            <div className="flex flex-col items-center gap-5">
                <p className="font-semibold text-gray-700">Tap the voice icon for voice communication.</p>
                <button onClick={handleVoice} className={`bg-gray-400/20 p-3 cursor-pointer rounded-full mt-0 md:mt-16`}>
                    <MdKeyboardVoice size={50}/>
                </button>
                <div>{listening ? 
                <ThreeDot variant="bounce" color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} size="small" text="" textColor="" />
                 : 
                 <p className="font-semibold text-2xl text-slate-500">Start Voice...</p>
                 }
                 </div>
            </div>
        </div>
    );
};

export default page;