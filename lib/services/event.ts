import { SolarDate } from "@nghiavuive/lunar_date_vi";
import _ from "lodash";
import moment from "moment";
import pool from "../db";

export default class EventService {
  static async getList(args: {
    userId: number;
    startDate: number;
    endDate: number;
  }) {
    const { userId, startDate, endDate } = args;
    if (!userId || !startDate || !endDate || startDate > endDate) return [];
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");
    const days = end.diff(start, "days") + 1;
    const range = Array.from({ length: days }, (_, i) => moment(start).clone().add(i, "days"));
    const solarMonths = _.uniq(range.map(d => d.get("month") + 1));
    const lunarMonths = _.uniq(range.map((d) => {
      const lunarDate = new SolarDate(d.toDate()).toLunarDate().get();
      return lunarDate.month
    }));
    const query = `
      SELECT * FROM events
      WHERE user_id = $1
      AND (
        (
          start_time >= $2 AND start_time < $3
        ) 
          OR 
        (
          recurring_type = 4
          AND
          (
           (
              recurring_month = ANY($4) AND is_lunar = $5
           )
           OR
           (
              recurring_month = ANY($6) AND is_lunar = $7
           )
          )
        )
      )
    `;

    const values = [
      userId,
      start.clone().valueOf(),
      end.clone().valueOf(),
      solarMonths,
      false,
      lunarMonths,
      true
    ];

    const result = await pool.query(query, values);
    return result.rows;
  }
}