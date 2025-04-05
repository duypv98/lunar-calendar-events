export default class User {
  id: number;
  account: string;
  password: string;
  name: string;

  constructor(data: Partial<User> = {}) {
    this.id = data.id ?? 0;
    this.account = data.account ?? "";
    this.password = data.password ?? "";
    this.name = data.name ?? "";
  }
}