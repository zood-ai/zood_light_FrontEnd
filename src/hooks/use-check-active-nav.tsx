import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    const pathArray = pathname.split('/').filter((item) => item !== '')
  
    if (nav === '/' && pathArray.length < 1) return true
    
    const navPath = nav.split('/')
    // return pathArray.includes(nav.replace(/^\//, ''))
    return pathArray[1] == navPath[2]
  }

  return { checkActiveNav }
}
