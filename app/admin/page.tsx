"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type LeadStatus = "new" | "in_progress" | "done"

type Lead = {
  id: number
  name: string
  phone: string
  service: string
  status: LeadStatus
  createdAt: string
}

type LeadsResponse = {
  success: true
  leads: Lead[]
}

const AUTH_KEY = "admin-auth"
const statusLabels: Record<LeadStatus, string> = {
  new: "new",
  in_progress: "in_progress",
  done: "done",
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [updatingLeadId, setUpdatingLeadId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY) === "true"
    if (!auth) {
      router.replace("/login")
      setIsCheckingAuth(false)
      return
    }

    setIsAuthorized(true)
    setIsCheckingAuth(false)
  }, [router])

  useEffect(() => {
    if (!isAuthorized) return

    const loadLeads = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/leads", {
          method: "GET",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to load leads")
        }

        const data = (await response.json()) as LeadsResponse
        setLeads(data.leads)
      } catch {
        setError("Ошибка загрузки заявок")
      } finally {
        setIsLoading(false)
      }
    }

    loadLeads()
  }, [isAuthorized])

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  )

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    router.replace("/login")
  }

  const handleStatusChange = async (leadId: number, nextStatus: LeadStatus) => {
    const prevLead = leads.find((lead) => lead.id === leadId)
    if (!prevLead || prevLead.status === nextStatus) return

    setError(null)
    setUpdatingLeadId(leadId)
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead))
    )

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }
    } catch {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: prevLead.status } : lead))
      )
      setError("Ошибка обновления статуса")
    } finally {
      setUpdatingLeadId(null)
    }
  }

  if (isCheckingAuth) {
    return (
      <section className="section-space bg-black">
        <div className="site-container text-zinc-400">Проверка доступа...</div>
      </section>
    )
  }

  if (!isAuthorized) return null

  return (
    <section className="section-space bg-black">
      <div className="site-container">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Admin</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Заявки
              </h1>
              <p className="mt-2 text-zinc-400">Всего: {leads.length}</p>
            </div>
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>

          {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
          {isLoading ? <p className="mb-4 text-sm text-zinc-400">Загрузка...</p> : null}

          <Table className="rounded-xl border border-white/10 bg-black/20">
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-zinc-400">
                    Заявок пока нет
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-white">{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.service}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as LeadStatus)}
                        disabled={updatingLeadId === lead.id}
                      >
                        <SelectTrigger className="h-9 w-[170px] border-white/15 bg-white/5 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">{statusLabels.new}</SelectItem>
                          <SelectItem value="in_progress">{statusLabels.in_progress}</SelectItem>
                          <SelectItem value="done">{statusLabels.done}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right text-zinc-400">
                      {dateFormatter.format(new Date(lead.createdAt))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
