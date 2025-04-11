import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

interface UserSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };
}
