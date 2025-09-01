'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'
import { createUser } from '@/action/User'
import { createProfile } from '@/action/Profile'
import { createCompany } from '@/action/Company'

export default function RegisterForm() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [tin, setTin] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    setLoading(true)
    try {
      if (password !== password2) {
      setError('Passwords do not match.')
      return
    }

      const userRes = await createUser({
        username: username,
        email: email,
        password: password,
        isOAuth: false,
        role: 'USER', 
        status: 'ACTIVE',
      })

      if (!userRes.success) {
        throw new Error(userRes.error || 'Failed to register user')
      }

      if (!userRes.data || !userRes.data.id) {
        throw new Error('User data is missing after registration');
      }
      const profileRes = await createProfile({
        fullname: `${firstName} ${lastName}`,
        phone: phone,
        address: address,
        nationalId: nationalId,
        user: {
          connect: { id: userRes.data.id }
        }
      })

      if (!profileRes.success) {
        throw new Error(profileRes.error || 'Failed to create profile')
      }

      const companyRes = await createCompany({
        name: companyName,
        TIN: tin,
        country: country,
        operator: {
          connect: { id: userRes.data.id }
        }
      })

      if (!companyRes.success) {
        throw new Error(companyRes.error || 'Failed to create company')
      }

      setSuccess('Registration successful! Redirecting...')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 text-sm">
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label htmlFor="firstName" className="primary">First Name</label>
            <input
              id="firstName"
              type="text"
              className="primary"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="lastName" className="primary">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="primary"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
          <label htmlFor="username" className="primary">Username</label>
          <input
            id="username"
            type="text"
            className="primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="email" className="primary">Email address</label>
          <input
            id="email"
            type="email"
            className="primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        </div>
        <div className="grid gap-1">
          <label htmlFor="company" className="primary">Company Name</label>
          <input
            id="company"
            type="text"
            className="primary"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="tin" className="primary">TIN</label>
          <input
            id="tin"
            type="text"
            className="primary"
            value={tin}
            onChange={(e) => setTin(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="phone" className="primary">Phone</label>
          <input
            id="phone"
            type="tel"
            className="primary"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+250123456789"
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="address" className="primary">Address</label>
          <input
            id="address"
            type="text"
            className="primary"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="nationalId" className="primary">National ID</label>
          <input
            id="nationalId"
            type="text"
            className="primary"
            onChange={(e) => setNationalId(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="country" className="primary">Country</label>
          <input
            id="country"
            type="text"
            className="primary"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1 relative">
          <label htmlFor="password" className="primary">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="primary pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-8 text-sm text-gray-600 hover:text-black"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        </div>
        <div className="grid gap-1">
          <label htmlFor="password2" className="primary">Confirm password</label>
          <input
            id="password2"
            type={showPassword2 ? "text" : "password"}
            className="primary pr-10"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button
          type="button"
          onClick={() => setShowPassword2(!showPassword2)}
          className="absolute right-2 top-8 text-sm text-gray-600 hover:text-black"
        >
          {showPassword2 ? "Hide" : "Show"}
        </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="grid gap-6">
        <SubmitButton size="lg" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </SubmitButton>
        <p className="text-center">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-primary">Login</Link>
        </p>
      </div>
    </form>
  )
}
