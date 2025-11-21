import { AuthResponse, LoginCredentials, RegisterData, User, Project, Contract, Conversation, Message } from "@/types";

// TODO: Replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Something went wrong");
    }
    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  // User endpoints
  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async updateMe(data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  // Project endpoints
  async getProjects(ownerId?: string): Promise<Project[]> {
    const url = ownerId 
      ? `${API_BASE_URL}/projects?ownerId=${ownerId}`
      : `${API_BASE_URL}/projects`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Project[]>(response);
  }

  async getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Project>(response);
  }

  async createProject(data: Omit<Project, "_id" | "ownerId" | "createdAt">): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Project>(response);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Project>(response);
  }

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Contract endpoints
  async getContracts(): Promise<Contract[]> {
    const response = await fetch(`${API_BASE_URL}/contracts`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Contract[]>(response);
  }

  async getContract(id: string): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Contract>(response);
  }

  async createContract(data: Omit<Contract, "_id" | "creatorId" | "createdAt">): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Contract>(response);
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Contract>(response);
  }

  async deleteContract(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Chat endpoints
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Conversation[]>(response);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Message[]>(response);
  }

  // Upload endpoints
  async getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }> {
    const response = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ fileName, fileType }),
    });
    return this.handleResponse<{ url: string; key: string }>(response);
  }

  async uploadFile(presignedUrl: string, file: File): Promise<void> {
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  }
}

export const api = new ApiService();
