import pool from "@/lib/db";
import { APIHandler, createHandler } from "@/utils/nextApi";

export default createHandler(new APIHandler({
  get: async (req, res) => {
    const result = await pool.query("SELECT * FROM events");
    return res.json(result.rows);
  }
}))