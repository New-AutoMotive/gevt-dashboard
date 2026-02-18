import { NextRequest, NextResponse } from "next/server";
import { getNationalMktShare } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const country = request.nextUrl.searchParams.get("country");
    const fuelType = request.nextUrl.searchParams.get("fuelType");
    const make = request.nextUrl.searchParams.get("make");

    if (!country || !fuelType || !make) {
      return NextResponse.json(
        { error: "country, fuelType, and make parameters are required" },
        { status: 400 }
      );
    }

    const data = await getNationalMktShare(country, fuelType, make);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching market share:", error);
    return NextResponse.json(
      { error: "Failed to fetch market share" },
      { status: 500 }
    );
  }
}
