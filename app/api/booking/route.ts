import { NextResponse } from "next/server"

type BookingPayload = {
  name?: string
  phone?: string
  service?: string
  message?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload

    const name = body?.name?.trim()
    const phone = body?.phone?.trim()
    const service = body?.service?.trim()
    const message = body?.message?.trim()

    if (!name || !phone || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("booking-form", { name, phone, service, message })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error("booking-form-error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
