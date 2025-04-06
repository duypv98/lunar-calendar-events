import pool from "@/lib/db";
import { APIHandler, createHandler, ParseQuery } from "@/utils/nextApi";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import EventService from "@/lib/services/event";

export default createHandler(new APIHandler({
  get: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    // @ts-ignore
    if (!session || !session.user?.id) return res.status(401).json({ error: "Unauthorized" });
    // @ts-ignore
    const userId = +session.user.id;
    const startDate = ParseQuery.num(req.query.startDate);
    const endDate = ParseQuery.num(req.query.endDate);
    const data = await EventService.getList({ userId, startDate, endDate });
    return res.json(data);
  }
}))