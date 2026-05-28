import { create } from "zustand";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: "OWNER" | "ADMIN" | "AGENT";
    avatarUrl: string | null;
  } | null;
  tenant: {
    id: string;
    name: string;
    slug: string;
    aiPersonaName: string;
    planTier: string;
  } | null;
  isLoading: boolean;
  setUser: (user: AuthState["user"]) => void;
  setTenant: (tenant: AuthState["tenant"]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setTenant: (tenant) => set({ tenant }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, tenant: null }),
}));

interface NotifState {
  unreadCount: number;
  waitingCS: number;
  setUnread: (count: number) => void;
  setWaitingCS: (count: number) => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  unreadCount: 3,
  waitingCS: 1,
  setUnread: (unreadCount) => set({ unreadCount }),
  setWaitingCS: (waitingCS) => set({ waitingCS }),
}));
