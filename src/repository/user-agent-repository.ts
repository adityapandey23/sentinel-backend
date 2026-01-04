import type { DbOrTransaction } from "@/db";
import type { NewUserAgent, UserAgent } from "@/model";

export interface UserAgentRepository {
  create(
    data: NewUserAgent,
    tx?: DbOrTransaction,
  ): Promise<UserAgent | undefined>;
  findById(id: string, tx?: DbOrTransaction): Promise<UserAgent | undefined>;
  update(
    id: string,
    data: Partial<NewUserAgent>,
    tx?: DbOrTransaction,
  ): Promise<UserAgent | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<UserAgent | undefined>;
}
