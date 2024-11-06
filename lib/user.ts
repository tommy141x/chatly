import { create } from "zustand";

type HashOptions = {
  algorithm: string;
  params?: Record<string, any>;
};

type Target = {
  provider: string;
  address: string;
};

type User = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  password: string;
  hash: string;
  hashOptions: HashOptions;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, any>;
  targets: Target[];
  accessedAt: string;
};

type UserState = {
  user: User;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: {
    $id: "",
    $createdAt: "",
    $updatedAt: "",
    name: "",
    password: "",
    hash: "",
    hashOptions: { algorithm: "" },
    registration: "",
    status: false,
    labels: [],
    passwordUpdate: "",
    email: "",
    phone: "",
    emailVerification: false,
    phoneVerification: false,
    mfa: false,
    prefs: {},
    targets: [],
    accessedAt: "",
  },

  setUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user },
    })),

  clearUser: () =>
    set({
      user: {
        $id: "",
        $createdAt: "",
        $updatedAt: "",
        name: "",
        password: "",
        hash: "",
        hashOptions: { algorithm: "" },
        registration: "",
        status: false,
        labels: [],
        passwordUpdate: "",
        email: "",
        phone: "",
        emailVerification: false,
        phoneVerification: false,
        mfa: false,
        prefs: {},
        targets: [],
        accessedAt: "",
      },
    }),
}));
