import { baseURL } from "../config";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocketConnection() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io(baseURL);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return { socket };
}
