import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import MyOrdersPage from './pages/MyOrdersPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    function handleHashChange() {
      setRoute(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route.startsWith('#/profile/orders')) {
    return <MyOrdersPage />
  }
  if (route.startsWith('#/profile/addresses')) {
    return <ShippingAddressPage />
  }
  if (route.startsWith('#/profile/settings')) {
    return <SettingsPage />
  }
  if (route.startsWith('#/profile')) {
    return <ProfilePage />
  }
  if (route.startsWith('#/cart')) {
    return <CartPage />
  }

  return <HomePage />
}

export default App
