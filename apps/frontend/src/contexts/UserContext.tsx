import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github';
  stats: {
    totalMatches: number;
    wins: number;
    losses: number;
    rank: number;
    bestTime: number;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};