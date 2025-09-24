// import express from "express";
// import { createServer } from "http";
// import next from "next";
// import { Server } from "socket.io";
// import axios from "axios";

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const expressApp = express();

//   // Middleware for JSON
//   expressApp.use(express.json());

//   // Custom API route for testing
//   expressApp.get("/api/hello", (req, res) => {
//     res.json({ message: "Hello socket.io" });
//   });

//   const httpServer = createServer(expressApp);

//   // Socket.IO setup
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//     transports: ["websocket", "polling"],
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket.io connected:", socket.id);

//     socket.on("send_message", async ({ text, lang }) => {
//       console.log("Message from client:", text, lang);

//       let prompt = text;
//       if (lang === "en") {
//         prompt = `You are a friendly assistant that answers in English. Always reply in a warm, polite, and conversational way. After answering the user's question, ask a related friendly question to keep the conversation going. Do not translate or add unnecessary explanation. Only answer the user's question directly and then ask a friendly question. User's question: ${text}`;
//       }
//       if (lang === "hi") {
//         prompt = `You are a friendly assistant that answers in Hindi. Always reply in a warm, polite, and conversational way. After answering the user's question, ask a related friendly question to keep the conversation going. Do not translate or add unnecessary explanation. Only answer the user's question directly and then ask a friendly question. User's question: ${text}`;
//       }

//       try {
//         const response = await axios.post(
//           "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//           { contents: [{ parts: [{ text: prompt }] }] },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "X-goog-api-key": process.env.GOOGLE_API_KEY,
//             },
//           }
//         );

//         const reply =
//           response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//           "No response";

//         socket.emit("receive_message", { reply });
//       } catch (error) {
//         console.error(error);
//         socket.emit("receive_message", {
//           reply: "Something went wrong with AI request.",
//         });
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   // Handle all other requests via Next.js
//   expressApp.use(handle);

//   const port = process.env.PORT || 3000;
//   httpServer.listen(port, () =>
//     console.log(`Server running at http://localhost:${port}`)
//   );
// });

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

  socket.on("send_message", async ({ text, lang }) => {
    console.log("Message:", text, lang);

    let prompt = text;
    if (lang === "en") {
      prompt = `You are a friendly assistant that answers in English. User's question: ${text}`;
    }
    if (lang === "hi") {
      prompt = `You are a friendly assistant that answers in Hindi. User's question: ${text}`;
    }

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GOOGLE_API_KEY } }
      );

      const reply = response?.data?.candidates[0]?.content?.parts[0]?.text || "No response";
      console.log(reply);
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

httpServer.listen(4000, () => console.log("Socket.IO server running on port 4000", process.env.GOOGLE_API_KEY));
