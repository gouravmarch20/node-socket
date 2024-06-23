import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = "asdasdsadasdasdasdsa";
const port = 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log(`hello`)

  res.send("Hello World!");
});


// app.get("/login", (req, res) => {
//   const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);

//   res
//     .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
//     .json({
//       message: "Login Success",
//     });
// });

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authentication Error"));

//     const decoded = jwt.verify(token, secretKeyJWT);
//     next();
//   });
// });

io.on("connection", (socket) => {
  // console.log("User Connected", socket.id);

  // socket.emit("welcome", `Welcome to server , ${socket.id} `);
  socket.broadcast.emit("welcome", `x  joined the server    , ${socket.id} `);

  socket.on("message", (  message  ) => {
    console.log("simple chat" ,  message );
    // io.emit("receive-message", message);
    socket.broadcast.emit("receive-message", message);
  });


  socket.on("private-room", ({ room, message }) => {
    console.log({ room, message });
    io.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  // socket.on("disconnect", () => {
  //   console.log("User Disconnected", socket.id);
  // });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});