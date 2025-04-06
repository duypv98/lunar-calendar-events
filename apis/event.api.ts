import Event from "@/models/Event";
import { get } from "@/utils/fetcher";
import { getNextEndpoint } from "@/utils/nextApi";

export const apiGetEvents = async (args: {
  startDate: number;
  endDate: number;
  signal?: AbortSignal;
}): Promise<Event[]> => {
  const { signal, ...params } = args;
  const { data, error } = await get({
    endpoint: getNextEndpoint("/api/events"),
    params,
    withCredentials: true,
    signal
  });
  return error ? [] : data;
}