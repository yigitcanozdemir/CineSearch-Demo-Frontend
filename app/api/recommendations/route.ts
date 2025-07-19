import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@gradio/client"

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    const client = await Client.connect("https://yigitcanozdemir-cinesearch-demo-backend.hf.space")
    const result = await client.predict("/predict", { message: query })

    const resultArray = result.data || []

    const backendData = Array.isArray(resultArray) ? resultArray[0] : {}

    const recommendations = backendData.recommendations || []
    const promptTitle = backendData.prompt_title || ""
    return NextResponse.json({
      success: true,
      data: {
        recommendations: recommendations,
        prompt_title: promptTitle,
      },
      count: recommendations.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        data: {
          recommendations: [],
          prompt_title: "",
        },
      },
      { status: 500 },
    )
  }
}
