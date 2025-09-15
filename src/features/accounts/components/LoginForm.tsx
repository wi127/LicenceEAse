'use client'

import React, { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'
import { signIn } from "next-auth/react"
import { getSessionUser } from '@/action/User'

export default function LoginForm() {

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password
        })
  
        if (res?.error) {
          setError(res.error || "Login failed.")
          setLoading(false)
          return null
        }

        const { user } = await getSessionUser()

        if (user.role === "ADMIN") {
          router.push("/admin-dashboard")
        } else {
          router.push("/client-dashboard")
        }
      } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 text-sm">
      <div className="grid gap-3">
        <div className="grid gap-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
          <input
            id="email"
            type="email"
            className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
          <input
            id="password"
            type="password"
            className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

      <div className="grid gap-6">
        <SubmitButton size="lg" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </SubmitButton>
        <p className="text-center">
          Don’t have an account?{' '}
          <Link href="/auth/sign-up" className="text-primary">Register</Link>
        </p>
      </div>
    </form>
  )
}
