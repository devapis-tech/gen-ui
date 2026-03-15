"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types/clinical-trial";

interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
}
