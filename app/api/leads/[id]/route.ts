import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const validStatuses = new Set(["new", "in_progress", "done"])

type StatusPayload = {
  status?: string
}

type PrismaKnownRequestErrorLike = {
  name?: string
  code?: string
}

function isPrismaKnownRequestError(error: unknown): error is PrismaKnownRequestErrorLike {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "PrismaClientKnownRequestError"
  )
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const leadId = Number(id)

  if (!Number.isInteger(leadId) || leadId <= 0) {
    return NextResponse.json({ error: "Invalid lead id" }, { status: 400 })
  }

  let body: StatusPayload

  try {
    body = (await request.json()) as StatusPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const status = body?.status?.trim()
  if (!status || !validStatuses.has(status)) {
    return NextResponse.json(
      { error: "Status must be one of: new, in_progress, done" },
      { status: 400 }
    )
  }

  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (isPrismaKnownRequestError(error) && error.code === "P2025") {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    console.error("lead-status-update-error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
