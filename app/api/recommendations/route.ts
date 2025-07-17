// app/api/recommendations/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Client } from "@gradio/client"

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    const client = await Client.connect("http://localhost:7860/")
    const result = await client.predict("/predict", { message: query })

    const recommendations = result.data || []

    return NextResponse.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      data: [],
    }, { status: 500 })
  }
}
