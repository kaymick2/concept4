import { Navigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import '../../App.css'

function ProtectedRoute({ children }) {
  const { authStatus } = useAuthenticator(context => [context.authStatus])

  if (authStatus === 'configuring') {
    return <div>Loading...</div>
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute