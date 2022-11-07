// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const userData = window.localStorage.getItem('userData')

    console.log(userData)

    if (userData) {

      console.log('GUEST GUARD USER DATA FOUND 2', userData)
      router.replace('/daily-standup/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  console.log("IN GUEST GUARD", auth)

  if (auth.loading || (!auth.loading && auth.user !== null)) {

    console.log('auth.loading || (!auth.loading && auth.user !== null)')
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
