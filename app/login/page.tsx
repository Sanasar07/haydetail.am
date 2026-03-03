"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const AUTH_KEY = "admin-auth"
const ADMIN_LOGIN = "admin"
const ADMIN_PASSWORD = "detailing123"

export default function LoginPage() {
  const router = useRouter()
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const isAuthorized = localStorage.getItem(AUTH_KEY) === "true"
    if (isAuthorized) {
      router.replace("/admin")
    }
  }, [router])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const isValid = login === ADMIN_LOGIN && password === ADMIN_PASSWORD
    if (!isValid) {
      setError("Неверный логин или пароль")
      setIsLoading(false)
      return
    }

    localStorage.setItem(AUTH_KEY, "true")
    router.replace("/admin")
  }

  return (
    <section className="section-space bg-black">
      <div className="site-container">
        <Card className="mx-auto w-full max-w-md border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <CardHeader>
            <p className="section-kicker">Admin</p>
            <CardTitle className="mt-2 text-3xl text-white">Вход</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                required
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                placeholder="Логин"
                className="h-11 border-white/15 bg-white/5 text-white placeholder:text-zinc-500"
              />
              <Input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Пароль"
                className="h-11 border-white/15 bg-white/5 text-white placeholder:text-zinc-500"
              />
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-70"
              >
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
