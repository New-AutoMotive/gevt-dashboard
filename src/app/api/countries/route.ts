import { NextRequest, NextResponse } from "next/server";
import { getCountries } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const withMakes = request.nextUrl.searchParams.get("withMakes") === "true";
    const countries = await getCountries(withMakes);
    return NextResponse.json({ countries });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
