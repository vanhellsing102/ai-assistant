// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req){
//     try {
//         const {text, lang} = await req.json();
//         let prompt = text;
//         if(lang === "en"){
//             prompt = `You are a friendly assistant that answers in English. Always reply in a warm, polite, and conversational way. After answering the user's question, ask a related friendly question to keep the conversation going. Do not translate or add unnecessary explanation. Only answer the user's question directly and then ask a friendly question. User's question: ${text}`;
//         }
//         if(lang === "hi"){
//              prompt = `You are a friendly assistant that answers in Hindi. Always reply in a warm, polite, and conversational way. After answering the user's question, ask a related friendly question to keep the conversation going. Do not translate or add unnecessary explanation. Only answer the user's question directly and then ask a friendly question. User's question: ${text}`;
//         }
//         // console.log("input text", text);
//         if(!text){
//             return NextResponse.json({error: "Text is required"}, {status: 400});
//         }
//         const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
//             contents: [{ parts: [{ text: prompt }] }]
//         },
//         {
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-goog-api-key": process.env.GOOGLE_API_KEY
//             }
//         }
//         )
//     const reply = response?.data?.candidates[0]?.content?.parts[0]?.text || "No response";
//     // console.log(reply);
//     return NextResponse.json({reply}, {status: 200});
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
// }