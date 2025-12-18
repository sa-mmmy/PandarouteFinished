import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://impactco2.fr/api/v1";
const API_KEY = "dbaeb124-88ca-4adb-8dc9-0f7587bff3fb";



export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const km = parseFloat(searchParams.get("km") || "0");
        const transports = parseInt(searchParams.get("transports") || "0");

        if (!km || !transports) {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }

        const params = new URLSearchParams({
            km: km.toString(),
            transports: transports.toString(),
            displayAll: "0",
            ignoreRadiativeForcing: "0",
            occupencyRate: "1",
            includeConstruction: "0",
            language: "fr",
        });

        const response = await fetch(`${BASE_URL}/transport?${params.toString()}`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: "API Error", details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("API Error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}