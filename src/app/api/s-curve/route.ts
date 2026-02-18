import { NextRequest, NextResponse } from "next/server";
import { getSCurveData } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const country = request.nextUrl.searchParams.get("country");
    if (!country) {
      return NextResponse.json(
        { error: "country parameter is required" },
        { status: 400 }
      );
    }
    const data = await getSCurveData(country);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching s-curve data:", error);
    return NextResponse.json(
      { error: "Failed to fetch s-curve data" },
      { status: 500 }
    );
  }
}
