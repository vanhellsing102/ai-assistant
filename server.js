import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";


const app = express();
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("send_message", async ({ text, langName, langType }) => {
    // console.log("Message:", langName, langType);
    if(!text){
        return NextResponse.json({error: "Text is required"}, {status: 400});
      }
    let prompt = `
You are a friendly assistant.
The user wants you to always respond ONLY in ${langName} (${langType}).
- Do not translate the response into any other language.
- Do not use English at all unless the requested language itself is English.
- Every sentence of your reply must be written in ${langName} (${langType}).
- After answering, ask one friendly related question in ${langName} (${langType}).

User's question: ${text}
`;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GOOGLE_API_KEY } }
      );

      const reply = response?.data?.candidates[0]?.content?.parts[0]?.text || "No response";
      // console.log(reply);
      socket.emit("receive_message", { reply });
    } catch (error) {
      console.error(error);
      socket.emit("receive_message", { reply: "Something went wrong with AI request." });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const port = process.env.PORT || 4000;

httpServer.listen(port, () => console.log("Socket.IO server running on port", port));
