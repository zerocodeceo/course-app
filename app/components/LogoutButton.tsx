export const handleLogout = () => {
  localStorage.removeItem('authToken')
  window.location.href = '/'
} 