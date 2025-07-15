import { IJwtPayload } from "./types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
