import { Details } from "express-useragent";

declare global {
  namespace Express {
    interface Request {
      useragent?: Details;
      user?: {
        userId: string;
        email?: string;
      };
    }
  }
}
