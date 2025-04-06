import Event from "@/models/Event";
import { get } from "@/utils/fetcher";
import { getNextEndpoint } from "@/utils/nextApi";

export const apiGetEvents = async (args: {
  startDate: number;
  endDate: number;
}): Promise<Event[]> => {
  const { data, error } = await get({
    endpoint: getNextEndpoint("/api/events"),
    params: args,
    withCredentials: true
  });
  return error ? [] : data;
}