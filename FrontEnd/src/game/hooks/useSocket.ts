import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [ping, setPing] = useState<number>(999);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", { transports: ["websocket"] });
    socketRef.current = socket;



    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const interval = setInterval(() => {
      const start = Date.now();
      socket.emit("pingCheck", () => {
        const latency = Date.now() - start;
        setPing(latency);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  return { ping };
};
