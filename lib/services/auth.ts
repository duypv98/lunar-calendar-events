import User from "@/models/User";
import pool from "../db";
import bcrypt from "bcryptjs";

export default class AuthService {
  static async hashPwd(plain: string) {
    const salt = await bcrypt.genSalt(12);
    // const pepper = process.env.AUTH_PEPPER ?? "";
    return bcrypt.hash(plain, salt);
  }

  static async comparePwd(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
  static async login(args: { account: string, password: string }) {
    const {
      account,
      password
    } = args;

    const query = `SELECT * FROM users WHERE account = $1`;
    const values = [account];
    const result = await pool.query(query, values);
    const user: User = result.rows[0];
    if (!user) return { code: "WRONG_CREDENTIALS" };
    const isMatchPwd = await this.comparePwd(password, user.password);
    console.log(isMatchPwd);
    if (!isMatchPwd) return { code: "WRONG_CREDENTIALS" };

    return {
      code: "SUCCESS",
      user: {
        id: user.id,
        account: user.account,
        name: user.name
      }
    }
  }
}