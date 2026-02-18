import { NextRequest, NextResponse } from "next/server";
import { getRegistrations } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const country = request.nextUrl.searchParams.get("country");
    if (!country) {
      return NextResponse.json(
        { error: "country parameter is required" },
        { status: 400 }
      );
    }
    const data = await getRegistrations(country);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
