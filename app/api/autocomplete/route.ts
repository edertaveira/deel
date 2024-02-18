import { NextApiRequest, NextApiResponse } from "next";
import countries from "../countries.json";
import { NextRequest } from "next/server";

interface Item {
  code: string;
  name: string;
}

interface ApiResponse {
  data?: Item[];
  message?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  if (q) {
    const data = countries.filter((item: Item) =>
      item.name.toLowerCase().includes(q.toString().toLowerCase())
    );
    return Response.json(data);
  } else {
    return new Response('Missing query parameter "q".', { status: 400 });
  }
}
