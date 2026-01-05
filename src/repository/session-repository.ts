import type { DbOrTransaction } from "@/db";
import type { NewSession, Session } from "@/model";
import type { GetSessionResponse } from "@/dto/session-response";

export interface SessionRepository {
  create(data: NewSession, tx?: DbOrTransaction): Promise<Session | undefined>;
  findById(id: string, tx?: DbOrTransaction): Promise<Session | undefined>;
  update(
    id: string,
    data: Partial<NewSession>,
    tx?: DbOrTransaction,
  ): Promise<Session | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<Session | undefined>;
  findByUserId(
    userId: string,
    tx?: DbOrTransaction,
  ): Promise<GetSessionResponse[]>;
  findByToken(
    token: string,
    tx?: DbOrTransaction,
  ): Promise<Session | undefined>;

  // Delete a session by ID if it belongs to the given user
  deleteByIdAndUserId(
    sessionId: string,
    userId: string,
    tx?: DbOrTransaction,
  ): Promise<boolean>;

  // Delete all sessions for a user except the specified one
  deleteAllExcept(
    userId: string,
    exceptSessionId: string,
    tx?: DbOrTransaction,
  ): Promise<number>;

  existsById(sessionId: string, tx?: DbOrTransaction): Promise<boolean>;
}
