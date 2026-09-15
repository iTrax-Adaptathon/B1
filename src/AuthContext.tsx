import React, { createContext, useContext, useEffect, useState } from "react";

export interface AppUser {
  uid: string;
  userId?: string;
  email: string;
  displayName: string;
  role: "employer" | "candidate" | null;
  avatarUrl?: string;
  bio?: string;
  // Employer specific fields
  company?: string;
  qualifications?: string;
  // Candidate specific fields
  experienceLevel?: string;
  targetRole?: string;
  skills?: string[];
  createdAt?: string;
}

export interface SignUpData {
  userId?: string;
  email: string;
  password: string;
  displayName: string;
  role: "employer" | "candidate";
  avatarUrl?: string;
  bio?: string;
  company?: string;
  qualifications?: string;
  experienceLevel?: string;
  targetRole?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setRole: (role: "employer" | "candidate") => Promise<void>;
  signIn: (emailOrUserId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  login: () => void;
  logout: () => void;
  updateProfile: (data: Partial<AppUser>) => void;
}

export const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
];

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  setRole: async () => {},
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  login: () => {},
  logout: () => {},
  updateProfile: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize standard demo accounts in mock storage
  useEffect(() => {
    const existingUsers = localStorage.getItem("mock_users_list");
    if (!existingUsers) {
      const demoUsers = [
        {
          uid: "mock-user-123",
          userId: "employer_demo",
          email: "employer@demo.com",
          password: "password123",
          displayName: "Sarah Jenkins",
          role: "employer",
          company: "TalentConnect Core Systems",
          qualifications: "Director of Talent Acquisition (10+ yrs tech hiring)",
          bio: "Leading engineering recruiting across distributed cloud architectures and AI teams.",
          avatarUrl: DEFAULT_AVATARS[0],
          createdAt: new Date().toISOString()
        },
        {
          uid: "cand-alex-1",
          userId: "candidate_demo",
          email: "candidate@demo.com",
          password: "password123",
          displayName: "Alex Rivers",
          role: "candidate",
          qualifications: "B.S. Computer Science • 4 Yrs Production Experience",
          bio: "Software engineer with 4 years of experience building and operating server-side systems and REST APIs.",
          targetRole: "Senior Backend Engineer",
          avatarUrl: DEFAULT_AVATARS[1],
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("mock_users_list", JSON.stringify(demoUsers));
    }

    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("mock_user");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (emailOrUserId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedInput = emailOrUserId.trim().toLowerCase();
    const allUsers = JSON.parse(localStorage.getItem("mock_users_list") || "[]");

    const found = allUsers.find(
      (u: any) =>
        (u.email.toLowerCase() === trimmedInput || (u.userId && u.userId.toLowerCase() === trimmedInput)) &&
        u.password === password
    );

    // Determine target role
    const isEmployerInput = trimmedInput.includes("employer") || trimmedInput.includes("hr") || trimmedInput.includes("admin");
    const targetRole = found ? found.role : (isEmployerInput ? "employer" : "candidate");

    // Enforce role switching constraint: cannot switch between employee and employer without signing out first
    if (user && user.role && user.role !== targetRole) {
      return {
        success: false,
        error: `You are currently signed in as a ${user.role === 'employer' ? 'Employer' : 'Candidate'}. You must sign out before switching between employee and employer.`
      };
    }

    if (found) {
      const { password: _, ...userSafe } = found;
      localStorage.setItem("mock_user", JSON.stringify(userSafe));
      setUser(userSafe);
      return { success: true };
    }

    // Flexible fallback for demo testing
    if (password === "password123" || password === "demo123" || password === "admin") {
      const isEmployer = isEmployerInput;
      const fallbackUser: AppUser = {
        uid: `user-${Date.now()}`,
        userId: trimmedInput.split("@")[0],
        email: trimmedInput.includes("@") ? trimmedInput : `${trimmedInput}@example.com`,
        displayName: trimmedInput.split("@")[0].toUpperCase(),
        role: isEmployer ? "employer" : "candidate",
        company: isEmployer ? "TechCorp Innovations" : undefined,
        qualifications: isEmployer ? "Lead Recruiter" : "Senior Software Engineer",
        bio: isEmployer ? "Building engineering teams." : "Passionate developer seeking exciting challenges.",
        avatarUrl: DEFAULT_AVATARS[0]
      };
      localStorage.setItem("mock_user", JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return { success: true };
    }

    return { success: false, error: "Invalid email/User ID or password. Use demo account or create an account." };
  };

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    if (!data.email || !data.password) {
      return { success: false, error: "Email and password are required." };
    }

    // Enforce role switching constraint: cannot switch between employee and employer without signing out first
    if (user && user.role && user.role !== data.role) {
      return {
        success: false,
        error: `You are currently signed in as a ${user.role === 'employer' ? 'Employer' : 'Candidate'}. You must sign out before switching between employee and employer.`
      };
    }

    const allUsers = JSON.parse(localStorage.getItem("mock_users_list") || "[]");
    const existing = allUsers.find((u: any) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: "An account with this email already exists. Please sign in." };
    }

    const newUser: AppUser & { password: string } = {
      uid: `user-${Date.now()}`,
      userId: data.userId || data.email.split("@")[0],
      email: data.email.trim(),
      password: data.password,
      displayName: data.displayName || data.email.split("@")[0],
      role: data.role,
      avatarUrl: data.avatarUrl || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      bio: data.bio || "",
      company: data.company,
      qualifications: data.qualifications,
      experienceLevel: data.experienceLevel,
      targetRole: data.targetRole,
      createdAt: new Date().toISOString()
    };

    allUsers.push(newUser);
    localStorage.setItem("mock_users_list", JSON.stringify(allUsers));

    const { password: _, ...userSafe } = newUser;
    localStorage.setItem("mock_user", JSON.stringify(userSafe));
    setUser(userSafe);

    return { success: true };
  };

  // Legacy quick login
  const login = () => {
    const newUser: AppUser = {
      uid: "mock-user-123",
      email: "demo@example.com",
      displayName: "Demo User",
      role: "candidate",
      avatarUrl: DEFAULT_AVATARS[1]
    };
    localStorage.setItem("mock_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("mock_user");
    setUser(null);
  };

  const setRole = async (role: "employer" | "candidate") => {
    if (user && !user.role) {
      const updatedUser = { ...user, role };
      localStorage.setItem("mock_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } else if (user && user.role !== role) {
      console.warn("User role is locked to this account. You must sign out first to switch between employee and employer.");
    }
  };

  const updateProfile = (data: Partial<AppUser>) => {
    if (user) {
      // Disallow mutating role directly via profile update
      const { role: _role, ...safeData } = data;
      const updatedUser = { ...user, ...safeData };
      localStorage.setItem("mock_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Also update in mock_users_list
      const allUsers = JSON.parse(localStorage.getItem("mock_users_list") || "[]");
      const idx = allUsers.findIndex((u: any) => u.uid === user.uid);
      if (idx !== -1) {
        allUsers[idx] = { ...allUsers[idx], ...safeData };
        localStorage.setItem("mock_users_list", JSON.stringify(allUsers));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setRole, signIn, signUp, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
