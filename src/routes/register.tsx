import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Card,
  FormGroup,
  InputGroup,
  Button,
  Callout,
  H3,
  Intent,
  Checkbox,
  ProgressBar
} from '@blueprintjs/core'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  // Calculate password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength += 0.25
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 0.25 // Has uppercase
    if (/[0-9]/.test(password)) strength += 0.25 // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 0.25 // Has special char
    
    setPasswordStrength(strength)
  }, [password])
  
  const getPasswordStrengthIntent = () => {
    if (passwordStrength < 0.25) return Intent.DANGER
    if (passwordStrength < 0.5) return Intent.WARNING
    if (passwordStrength < 0.75) return Intent.PRIMARY
    return Intent.SUCCESS
  }
  
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength < 0.25) return 'Very Weak'
    if (passwordStrength < 0.5) return 'Weak'
    if (passwordStrength < 0.75) return 'Moderate'
    if (passwordStrength < 1) return 'Strong'
    return 'Very Strong'
  }
  
  const validateForm = () => {
    // Name validation
    if (!fullName.trim()) {
      setError('Full name is required')
      return false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    
    if (passwordStrength < 0.5) {
      setError('Please use a stronger password with uppercase letters, numbers, and special characters')
      return false
    }
    
    // Confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    // Terms acceptance
    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy')
      return false
    }
    
    return true
  }
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setError(null)
    setIsRegistering(true)
    
    // Simulate registration process
    setTimeout(() => {
      setIsRegistering(false)
      // In a real app, you would handle registration here
      // For demo purposes, we'll just show a success message
      alert('Registration successful! Please check your email to verify your account.')
    }, 1500)
  }
  
  const passwordToggleButton = (
    <Button
      icon={showPassword ? "eye-open" : "eye-off"}
      minimal
      onClick={() => setShowPassword(!showPassword)}
    />
  )
  
  return (
    <div className="register-container" style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <div className="register-logo" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <H3>Create Your Account</H3>
        <p>Join Palm Tree Analyzer to start analyzing your palm trees</p>
      </div>
      
      <Card elevation={2}>
        {error && (
          <Callout intent={Intent.DANGER} title="Registration Error" style={{ marginBottom: '20px' }}>
            {error}
          </Callout>
        )}
        
        <form onSubmit={handleRegister}>
          <FormGroup
            label="Full Name"
            labelFor="fullname-input"
            labelInfo="(required)"
          >
            <InputGroup
              id="fullname-input"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              large
              fill
            />
          </FormGroup>
          
          <FormGroup
            label="Email Address"
            labelFor="email-input"
            labelInfo="(required)"
          >
            <InputGroup
              id="email-input"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              large
              fill
            />
          </FormGroup>
          
          <FormGroup
            label="Password"
            labelFor="password-input"
            labelInfo="(required)"
            helperText={
              password ? 
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Password strength:</span>
                    <span style={{ fontWeight: 'bold' }}>{getPasswordStrengthLabel()}</span>
                  </div>
                  <ProgressBar 
                    value={passwordStrength} 
                    intent={getPasswordStrengthIntent()} 
                    stripes={false}
                  />
                </div> : 
                "Password must be at least 8 characters with uppercase, numbers, and special characters"
            }
          >
            <InputGroup
              id="password-input"
              placeholder="Create a password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={passwordToggleButton}
              large
              fill
            />
          </FormGroup>
          
          <FormGroup
            label="Confirm Password"
            labelFor="confirm-password-input"
            labelInfo="(required)"
          >
            <InputGroup
              id="confirm-password-input"
              placeholder="Confirm your password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              large
              fill
            />
          </FormGroup>
          
          <div style={{ marginBottom: '20px' }}>
            <Checkbox
              label={
                <span>
                  I accept the <a href="#" style={{ color: 'var(--accent-color)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--accent-color)' }}>Privacy Policy</a>
                </span>
              }
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
          </div>
          
          <Button
            type="submit"
            intent={Intent.PRIMARY}
            text="Create Account"
            loading={isRegistering}
            large
            fill
          />
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Log in</Link>
        </div>
      </Card>
    </div>
  )
}