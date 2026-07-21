import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import ApplicationForm from './pages/ApplicationForm'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/applications/new" element={
          <ProtectedRoute><ApplicationForm /></ProtectedRoute>
        } />
        <Route path="/applications/edit/:id" element={
          <ProtectedRoute><ApplicationForm /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App