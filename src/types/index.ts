export interface User {
  _id: string;
  name: string;
  email: string;
  role: "freelancer" | "empresa";
  bio?: string;
  skills?: string[];
  university?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  ownerId: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  createdAt: string;
  owner?: User;
}

export interface Contract {
  _id: string;
  creatorId: string;
  projectId?: string;
  title: string;
  description: string;
  status: "published" | "in_progress" | "completed";
  createdAt: string;
  creator?: User;
  project?: Project;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  relatedProjectId?: string;
  relatedContractId?: string;
  createdAt: string;
  sender?: User;
}

export interface Conversation {
  _id: string;
  members: string[];
  createdAt: string;
  lastMessage?: Message;
  otherUser?: User;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "freelancer" | "empresa";
}
