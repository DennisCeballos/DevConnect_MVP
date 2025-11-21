import { io, Socket } from "socket.io-client";
import { Message } from "@/types";

// TODO: Replace with your actual WebSocket URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string) {
    this.socket?.emit("join_conversation", conversationId);
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit("leave_conversation", conversationId);
  }

  sendMessage(message: { conversationId: string; content: string; receiverId: string }) {
    this.socket?.emit("send_message", message);
  }

  onMessageReceived(callback: (message: Message) => void) {
    this.socket?.on("message_received", callback);
  }

  offMessageReceived() {
    this.socket?.off("message_received");
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
