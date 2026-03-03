import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { sendLeadTelegramNotification } from "@/lib/lead-notifier"

type LeadPayload = {
  name?: string
  phone?: string
  service?: string
  message?: string
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        service: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, leads }, { status: 200 })
  } catch (error) {
    console.error("lead-list-error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let body: LeadPayload

  try {
    body = (await request.json()) as LeadPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = body?.name?.trim()
  const phone = body?.phone?.trim()
  const service = body?.service?.trim() || "Не указано"
  const message = body?.message?.trim() || null

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 }
    )
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        service,
        message,
      },
    })

    try {
      await sendLeadTelegramNotification({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        service: lead.service,
        message: lead.message,
        status: lead.status,
        createdAt: lead.createdAt,
      })
    } catch (notifyError) {
      console.error("lead-notification-error", notifyError)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("lead-create-known-prisma-error", error.code, error.message)
      return NextResponse.json({ error: "Database request error" }, { status: 500 })
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("lead-create-validation-prisma-error", error.message)
      return NextResponse.json({ error: "Database validation error" }, { status: 400 })
    }

    console.error("lead-create-unexpected-error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
