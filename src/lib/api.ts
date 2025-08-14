import { getAuth } from 'firebase/auth'
import app from '@/firebase'

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const auth = getAuth(app)
  const user = auth.currentUser

  if (!user) {
    throw new APIError(401, 'User not authenticated')
  }

  try {
    // Get fresh token (Firebase handles refresh automatically)
    const token = await user.getIdToken(true)
    
    const headers: any = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
    }
    
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh and retry once
        const newToken = await user.getIdToken(true)
        localStorage.setItem('authToken', newToken)
        
        const retryHeaders: any = {
          ...(options.headers || {}),
          'Authorization': `Bearer ${newToken}`,
        }
        
        if (!(options.body instanceof FormData)) {
          retryHeaders['Content-Type'] = 'application/json'
        }

        const retryResponse = await fetch(url, {
          ...options,
          headers: retryHeaders,
        })

        if (!retryResponse.ok) {
          throw new APIError(retryResponse.status, data.error || 'Request failed')
        }

        return await retryResponse.json()
      }
      
      throw new APIError(response.status, data.error || 'Request failed')
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(500, 'Network error')
  }
}
