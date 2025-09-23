import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {text} = await req.json();
        // console.log("input text", text);
        if(!text){
            return NextResponse.json({error: "Text is required"}, {status: 400});
        }
        const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
            contents: [{ parts: [{ text: text }] }]
        },
        {
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.GOOGLE_API_KEY
            }
        }
        )
    const reply = response?.data?.candidates[0]?.content?.parts[0]?.text || "No response";
    // console.log(reply);
    return NextResponse.json({reply}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}