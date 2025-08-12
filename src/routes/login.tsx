import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Card,
  FormGroup,
  InputGroup,
  Checkbox,
  Button,
  Callout,
  H3,
  Intent
} from '@blueprintjs/core'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email.trim()) {
      setError('Username is required')
      return
    }
    
    if (!password) {
      setError('Password is required')
      return
    }
    
    setError(null)
    setIsLoggingIn(true)
    
    try {
      const success = await login({
        email,
        password,
        rememberMe
      })
      
      if (success) {
        // Redirect to upload page after successful login
        navigate({ to: '/upload' })
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const lockButton = (
    <Button
      icon={showPassword ? "eye-open" : "eye-off"}
      minimal
      onClick={() => setShowPassword(!showPassword)}
    />
  )

  return (
    <div className="login-container">
      <div className="login-logo">
        <H3>Palm Tree Analyzer</H3>
      </div>
      
      <Card elevation={2}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        
        {error && (
          <Callout intent={Intent.DANGER} title="Error" style={{ marginBottom: '20px' }}>
            {error}
          </Callout>
        )}
        
        <form onSubmit={handleLogin}>
          <FormGroup
            label="Username or Email"
            labelFor="username-input"
          >
            <InputGroup
              id="username-input"
              placeholder="Enter your username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              large
              fill
            />
          </FormGroup>
          
          <FormGroup
            label="Password"
            labelFor="password-input"
          >
            <InputGroup
              id="password-input"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={lockButton}
              large
              fill
            />
          </FormGroup>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <a href="#" style={{ color: 'var(--accent-color)' }}>Forgot password?</a>
          </div>
          
          <Button
            type="submit"
            intent={Intent.PRIMARY}
            text="Login"
            loading={isLoggingIn}
            large
            fill
          />
        </form>
      </Card>
    </div>
  )
}