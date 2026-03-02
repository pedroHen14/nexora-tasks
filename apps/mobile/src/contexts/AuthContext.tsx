import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@nexora/shared';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

const USER_KEY = '@nexora:user';
const TOKEN_KEY = '@nexora:token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet([USER_KEY, TOKEN_KEY]).then(([userPair, tokenPair]) => {
      if (userPair[1] && tokenPair[1]) {
        setUser(JSON.parse(userPair[1]));
        setToken(tokenPair[1]);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (userData: User, userToken: string) => {
    await AsyncStorage.multiSet([
      [USER_KEY, JSON.stringify(userData)],
      [TOKEN_KEY, userToken],
    ]);
    setUser(userData);
    setToken(userToken);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
