import type { DbOrTransaction } from "@/db";
import type { NewSession, Session } from "@/model";
import type { GetSessionResponse } from "@/dto/session-response";

export interface SessionRepository {
  create(data: NewSession, tx?: DbOrTransaction): Promise<Session | undefined>;
  findById(id: string, tx?: DbOrTransaction): Promise<Session | undefined>;
  update(id: string, data: Partial<NewSession>, tx?: DbOrTransaction): Promise<Session | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<Session | undefined>;
  findByUserId(userId: string, tx?: DbOrTransaction): Promise<GetSessionResponse[]>;
  findByToken(token: string, tx?: DbOrTransaction): Promise<Session | undefined>;
}
