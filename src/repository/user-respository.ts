import type { DbOrTransaction } from "@/db";
import type { NewUser, User } from "@/model";

export interface UserRepository {
  create(data: NewUser, tx?: DbOrTransaction): Promise<User | undefined>;
  findById(id: string, tx?: DbOrTransaction): Promise<User | undefined>;
  update(id: string, data: Partial<NewUser>, tx?: DbOrTransaction): Promise<User | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<User | undefined>;
  findByEmail(email: string, tx?: DbOrTransaction): Promise<User | undefined>;
}
