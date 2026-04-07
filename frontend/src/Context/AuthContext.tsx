import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponseDto, UserResponseDto, AuthContextType} from '../Types';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = (data: AuthResponseDto) => {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    };

    const logout = () => {
      setUser(null);
      setToken(null);
        localStorage.removeItem('token');
    };

    return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };