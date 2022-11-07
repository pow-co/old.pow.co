// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      console.log('AUTH GUARD', { user: auth.user })

      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }

      console.log('auth passed')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  console.log('--auth', auth)

  if (auth.loading || auth.user === null) {
    console.log("AUTH.LOADING", auth.loading)

    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
