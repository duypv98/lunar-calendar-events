import { NextApiHandler, NextApiResponse } from "next";

export const errorResponse = (res: NextApiResponse, statusCode: number = 500, message: string = "Internal Server Error") => {
  res.status(statusCode).send(message);
  res.end();
  return;
}

export const getNextEndpoint = (endpoint: string) => {
  if (endpoint.startsWith("http")) return endpoint;
  return `${window.location.origin}${endpoint}`;
}

export class APIHandler {
  get?: NextApiHandler;
  post?: NextApiHandler;
  patch?: NextApiHandler;
  del?: NextApiHandler;
  constructor(args: Partial<Record<"get" | "post" | "patch" | "del", NextApiHandler>>) {
    this.get = args.get;
    this.post = args.post;
    this.patch = args.patch;
    this.del = args.del;
  }
}

export const createHandler = (args: APIHandler): NextApiHandler => (req, res) => {
  if (req.method === "GET" && args.get) {
    return args.get(req, res);
  }
  if (req.method === "POST" && args.post) {
    return args.post(req, res);
  }
  if (req.method === "PATCH" && args.patch) {
    return args.patch(req, res);
  }
  if (req.method === "DELETE" && args.del) {
    return args.del(req, res);
  }
  return res.status(405).json({ message: "Method is not allowed" });
}

type QueryParamValue = string | string[] | undefined;
type ParseQueryFn<R> = (value: QueryParamValue, defaultValue?: R) => R | undefined;
export class ParseQuery {
  static num: ParseQueryFn<number> = (v, d) => typeof v === "string" && !isNaN(+v) ? +v : (!isNaN(d) ? d : undefined);
  static str: ParseQueryFn<string> = (v, d) => typeof v === "string" ? v : (typeof d === "string" ? d : undefined);
  static bool: ParseQueryFn<boolean> = (v, d) => typeof v === "string" && ["true", "false"].includes(v) ? !!JSON.parse(v) : (typeof d === "boolean" ? d : undefined);
  static arrStr: ParseQueryFn<string[]> = (v, d) => Array.isArray(v) && v.every((e) => typeof e === "string")
    ? v as string[]
    : (typeof v === "string" ? v.split(",") : (Array.isArray(d) && d.every((e) => typeof e === "string") ? d : undefined));
  static arrNum: ParseQueryFn<number[]> = (v, d) => {
    const parsedStr = this.arrStr(v);
    return !!parsedStr && parsedStr.every((e) => !isNaN(+e)) ? parsedStr.map((e) => +e) : (Array.isArray(d) && d.every((e) => !isNaN(+e)) ? d : undefined);
  }
};