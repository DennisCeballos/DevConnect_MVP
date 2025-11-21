import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/services/api";
import { socketService } from "@/services/socket";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation, Message } from "@/types";
import { Send, MessageSquare } from "lucide-react";

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Socket listeners
    socketService.onMessageReceived((message) => {
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketService.offMessageReceived();
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      socketService.joinConversation(selectedConversation._id);

      return () => {
        socketService.leaveConversation(selectedConversation._id);
      };
    }
  }, [selectedConversation]);

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await api.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const otherUserId = selectedConversation.members.find((id) => id !== user._id);
    if (!otherUserId) return;

    socketService.sendMessage({
      conversationId: selectedConversation._id,
      content: newMessage,
      receiverId: otherUserId,
    });

    setNewMessage("");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid h-[calc(100vh-12rem)] gap-4 lg:grid-cols-[300px,1fr]">
          {/* Conversations List */}
          <Card className="flex flex-col">
            <div className="border-b p-4">
              <h2 className="font-semibold">Conversaciones</h2>
            </div>
            <ScrollArea className="flex-1">
              {conversations.length > 0 ? (
                <div className="space-y-2 p-4">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation._id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                        selectedConversation?._id === conversation._id ? "bg-accent" : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.otherUser?.profileImageUrl} />
                        <AvatarFallback>
                          {conversation.otherUser?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium">{conversation.otherUser?.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {conversation.lastMessage?.content || "Sin mensajes"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No hay conversaciones aún</p>
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat Window */}
          <Card className="flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b p-4">
                  <Avatar>
                    <AvatarImage src={selectedConversation.otherUser?.profileImageUrl} />
                    <AvatarFallback>
                      {selectedConversation.otherUser?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.otherUser?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.otherUser?.role === "freelancer"
                        ? "Freelancer"
                        : "Empresa"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId === user?._id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user?._id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="mt-1 text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString("es-PE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground" />
                <p className="font-medium">Selecciona una conversación</p>
                <p className="text-sm text-muted-foreground">
                  Elige una conversación para empezar a chatear
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
