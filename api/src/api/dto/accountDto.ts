export interface IAccount {
  id: number;
  address: string;
  name?: string;
  img?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IAccountCreateDto
  extends Omit<IAccount, "id" | "createdAt" | "updatedAt"> {}
