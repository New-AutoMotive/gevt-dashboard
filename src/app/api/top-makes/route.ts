import { NextRequest, NextResponse } from "next/server";
import { getTopMakes } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const country = request.nextUrl.searchParams.get("country");
    const type = request.nextUrl.searchParams.get("type") as
      | "alltime"
      | "monthly"
      | null;

    if (!country || !type || !["alltime", "monthly"].includes(type)) {
      return NextResponse.json(
        { error: "country and type (alltime|monthly) parameters are required" },
        { status: 400 }
      );
    }

    const data = await getTopMakes(country, type);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching top makes:", error);
    return NextResponse.json(
      { error: "Failed to fetch top makes" },
      { status: 500 }
    );
  }
}
