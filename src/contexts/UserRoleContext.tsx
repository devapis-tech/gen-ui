"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types/clinical-trial";
import { useCopilotReadable } from "@copilotkit/react-core";

interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  organization: string;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>({
    id: "rahul-multiplier",
    title: "ADMIN",
    badge: "INTERNAL TEAM",
    description: "Rahul (Internal)"
  });
  const [organization] = useState("Multiplier AI");

  useCopilotReadable({
    description: "Current user and organization context.",
    value: { userRole, organization }
  });

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, organization }}>
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
