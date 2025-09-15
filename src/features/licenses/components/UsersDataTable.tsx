'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchUsers } from '@/action/User'

type User = {
  id: string
  email: string
  username: string
  role: string
  status: string
  createdAt: Date
}



export default function UsersDataTable() {
  const [rows, setRows] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const res =  await fetchUsers({
          id: true,
          email: true,
          username: true,
          role: true,
          status: true,
          createdAt: true       
        })

        setRows(res.data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError(err instanceof Error ? err.message : 'Failed to load users')
        setRows([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Table className="w-full min-w-[1000px]">
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>CreatedAt</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Loading users...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <div className="text-red-600 dark:text-red-400">
                <p className="font-medium">Error loading users</p>
                <p className="text-sm">{error}</p>
              </div>
            </TableCell>
          </TableRow>
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                <p>No user found</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          rows.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                {/* <div className="font-medium text-gray-900 dark:text-white">
                  {user.id}
                </div> */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user.id || 'No ID available'}
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {user.email || 'No email available'}
                </p>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {user.username || 'No username available'}
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {user.role || 'No role available'}
                </p>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {user.status || 'No status available'}
                </p>
              </TableCell>
              <TableCell>
              <div className='text-sm'>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className='text-xs text-gray-500'>
                {new Date(user.createdAt).toLocaleTimeString()}
              </div>
            </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
                    delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
