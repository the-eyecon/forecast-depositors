import { NextResponse } from "next/server";
import { runScan } from "../../../../multichain.js";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    console.log("API trigger: Starting blockchain crawling...");
    const updatedData = await runScan();
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error("Scan route failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute scan" },
      { status: 500 }
    );
  }
}
