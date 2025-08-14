"use client";

import { TSessionUserSelect } from "../lib/types/session";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
     user: TSessionUserSelect | null | undefined;
     setUser: (user: TSessionUserSelect | null | undefined) => void;
     authOn: boolean;
     setAuthOn: (option:boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({authUser, children}:{children: ReactNode, authUser: TSessionUserSelect | null | undefined}) {
     const [user, setUser] = useState<TSessionUserSelect | null | undefined>(authUser);
     const [authOn, setAuthOn] = useState(authUser ? false : true);
     
     return (
          <AuthContext.Provider value={{user, setUser, authOn, setAuthOn}}>
               {children}
          </AuthContext.Provider>
     )
}

export function useAuthContext() {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error("useAuthContext must be used within an AuthProvider");
     }
     return context;
}