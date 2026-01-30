'use client'

import SubmitButton from '@/components/SubmitButton'
import { licenseCategories } from '@/features/licenses/schema/licenseSchema'
import React, { useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

interface Props { }

const validTypes = ['first-time-application-fee', 'first-time-license-fee']

export default function PayPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)

  const licenseParam = params?.license as string
  const typeParam = searchParams.get('type') as string

  if (!validTypes.includes(typeParam)) return (
    <div className='container py-12 text-center'>
      <h1 className='text-2xl text-destructive font-semibold'>Error parsing payment type</h1>
    </div>
  )
  const paymentType = typeParam.replaceAll('-', ' ')
  const license = licenseCategories.flatMap(category => category.licenses).find(license => license.id.toString() === licenseParam)
  if (!license) return "Not found"

  const handlePaymentComplete = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update application status in backend
      const token = localStorage.getItem('authToken')
      await fetch('http://127.0.0.1:5002/applications/payment-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          licenseId: licenseParam,
          paymentType: typeParam
        })
      })

      // Redirect to dashboard with success message
      router.push('/client-dashboard?tab=dashboard&payment=success')
    } catch (error) {
      console.error('Payment processing error:', error)
      alert('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  return (
    <div className='container py-12 space-y-12'>
      <div className='grid gap-4 max-w-lg mx-auto text-center  capitalize'>
        <h2 className='text-2xl text-balance font-bold'>{license.name}</h2>
        <p className='text-2xl font-semibold text-primary'>{paymentType}</p>
      </div>
      <div className='max-w-md mx-auto '>
        <div className='grid gap-2'>
          <h3 className='font-medium'>Pay with mobile money</h3>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const phoneNumber = formData.get('phone') as string
            console.log('Processing mobile money payment for:', phoneNumber)
            handlePaymentComplete()
          }} className='flex items-center gap-4 text-sm'>
            <input
              type="tel"
              name="phone"
              placeholder='Phone Number'
              className='primary w-full max-w-md'
              required
              pattern="[0-9]{10,13}"
              disabled={isProcessing}
            />
            <SubmitButton className='flex-grow' disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay'}
            </SubmitButton>
          </form>
        </div>
        <div className='flex items-center gap-2 py-6 font-medium text-sm'><span className='flex-grow border-t-2'></span>Or<span className='flex-grow border-t-2'></span></div>
        <div className='grid'>
          <SubmitButton
            variant={'accent'}
            disabled={isProcessing}
            onClick={() => {
              console.log('Processing card payment')
              handlePaymentComplete()
            }}
          >
            {isProcessing ? 'Processing...' : 'Pay with Card'}
          </SubmitButton>
        </div>
      </div>
    </div>
  )
}
