// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  powcoBalance: 0
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)
  const [powcoBalance, setPowcoBalance] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

      console.log('STORED TOKEN', storedToken)
      if (storedToken) {
        setLoading(true)
        await handleLogin()

        setLoading(false)


        /*await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
            handleLogin()
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
          */
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  
  useEffect(function() {

    (async () => {

      const { data } = await axios.get('https://staging-backend.relayx.com/api/token/93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2/owners')


      const [owner] = data.data.owners.filter((owner: any) => {
        
        return owner.paymail === user?.paymail
      })

      console.log('OWNER', { owner, user })
  
      setPowcoBalance(owner?.amount)

    })();


  }, [user])

  const handleLogin = async () => {

    console.log('HANDLE LOGIN')

    try {
            // @ts-ignore
            const token = await relayone.authBeta();

            console.log({token})

            const json = JSON.parse(atob(token.split('.')[0]));
            console.log({json})
            localStorage.setItem('powco.auth.type', 'relayx');
            localStorage.setItem('powco.auth.relayx.token', token);
            localStorage.setItem('powco.auth.relayx.auth', JSON.stringify(json));
            localStorage.setItem('powco.auth.relayx.paymail', json.paymail);
            localStorage.setItem('powco.auth.relayx.pubkey', json.pubkey);
            localStorage.setItem('powco.auth.relayx.origin', json.origin);
            localStorage.setItem('powco.auth.relayx.issued_at', json.issued_at);

            localStorage.setItem('userData', JSON.stringify(Object.assign(json, {
              email: json.paymail,
              role: 'relayx'
            })))
            localStorage.setItem('refreshToken', token)
            localStorage.setItem('accessToken', token)
      
            setUser(json)

            const routeOnLogin = localStorage.getItem('powco.auth.routeOnLogin')

            if (routeOnLogin) {

              localStorage.setItem('powco.auth.routeOnLogin', '/top')

              router.replace(routeOnLogin)

            } else {

              router.replace('/top')

            }
            

    } catch(error) {

      console.error('powco.auth.relayx.error', error)
    
    }

  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin()
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    powcoBalance
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
