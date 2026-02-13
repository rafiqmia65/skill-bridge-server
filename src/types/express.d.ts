import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
      token?: string;
    }
  }
}

import { User as AuthUser } from "better-auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      userId?: string;
      token?: string;
    }
  }
}
