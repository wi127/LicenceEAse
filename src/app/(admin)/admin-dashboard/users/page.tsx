import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import UsersDataTable from '@/features/licenses/components/UsersDataTable'

export default function page() {
  return (
    <main className='grid gap-6 px-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl capitalize font-bold'>Licenses</h2>
        <Link href={'/admin-dashboard/users/create'} className={buttonVariants()}>New License</Link>
      </div>
      <div>
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent className='grid'>
            <UsersDataTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
