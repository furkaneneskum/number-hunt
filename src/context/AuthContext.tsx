import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  getSessionUsername,
  loginUser,
  logout as logoutStorage,
  getLeaderboard,
  type LeaderboardEntry,
} from '../services/storage';

interface AuthContextValue {
  username: string | null;
  isAuthenticated: boolean;
  leaderboard: LeaderboardEntry[];
  login: (username: string) => { error?: string };
  logout: () => void;
  refreshLeaderboard: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => getSessionUsername());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    getLeaderboard(getSessionUsername())
  );

  const refreshLeaderboard = useCallback(() => {
    setLeaderboard(getLeaderboard(username));
  }, [username]);

  useEffect(() => {
    refreshLeaderboard();
  }, [username, refreshLeaderboard]);

  const login = useCallback((raw: string) => {
    try {
      const result = loginUser(raw);
      setUsername(result.username);
      setLeaderboard(getLeaderboard(result.username));
      return {};
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Giriş başarısız.' };
    }
  }, []);

  const logout = useCallback(() => {
    logoutStorage();
    setUsername(null);
    setLeaderboard(getLeaderboard(null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username,
        isAuthenticated: !!username,
        leaderboard,
        login,
        logout,
        refreshLeaderboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
