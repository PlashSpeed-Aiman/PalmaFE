import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Card,
  FormGroup,
  InputGroup,
  Button,
  Callout,
  H3,
  Intent,
  Spinner,
  Divider
} from '@blueprintjs/core'
import { useAuth } from '../contexts/AuthContext'
import { myToaster } from '../main'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, loading, navigate])
  
  // Initialize form fields when user data is available
  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setEmail(user.email || '')
      setFullName(user.fullName || '')
    }
  }, [user])
  
  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
    setSuccess(null)
  }
  
  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setUsername(user.username || '')
      setEmail(user.email || '')
      setFullName(user.fullName || '')
    }
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }
  
  const handleSave = async () => {
    // Basic validation
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    
    setError(null)
    setSuccess(null)
    setIsSaving(true)
    
    try {
      // Get API URL from environment
      const API_URL = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      
      const response = await fetch(`${API_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          fullName
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Profile updated successfully')
        setIsEditing(false)
        // Force refresh of user data (ideally, the AuthContext should provide a refresh method)
        window.location.reload()
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Profile update error:', err)
      setError('An error occurred while updating your profile')
      myToaster.show({
        message: 'An error occurred while updating your profile',
        intent: Intent.DANGER
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spinner size={50} />
      </div>
    )
  }
  
  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <H3>User Profile</H3>
      <Card elevation={2} style={{ marginTop: '20px' }}>
        {error && (
          <Callout intent={Intent.DANGER} title="Error" style={{ marginBottom: '20px' }}>
            {error}
          </Callout>
        )}
        
        {success && (
          <Callout intent={Intent.SUCCESS} title="Success" style={{ marginBottom: '20px' }}>
            {success}
          </Callout>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <h3>User Information</h3>
          <Divider />
          
          <FormGroup
            label="Username"
            labelFor="username-input"
            labelInfo={isEditing ? "(required)" : ""}
          >
            <InputGroup
              id="username-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing || isSaving}
            />
          </FormGroup>
          
          <FormGroup
            label="Email"
            labelFor="email-input"
          >
            <InputGroup
              id="email-input"
              placeholder="Email"
              value={email}
              disabled={true}  // Email cannot be changed
              helperText="Email cannot be changed"
            />
          </FormGroup>
          
          <FormGroup
            label="Full Name"
            labelFor="fullname-input"
          >
            <InputGroup
              id="fullname-input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing || isSaving}
            />
          </FormGroup>
          
          <FormGroup
            label="Role"
            labelFor="role-input"
          >
            <InputGroup
              id="role-input"
              placeholder="Role"
              value={user?.role || 'User'}
              disabled={true}  // Role cannot be changed by user
              helperText="Role cannot be changed by user"
            />
          </FormGroup>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {isEditing ? (
            <>
              <Button
                text="Cancel"
                onClick={handleCancel}
                disabled={isSaving}
              />
              <Button
                intent={Intent.PRIMARY}
                text="Save Changes"
                onClick={handleSave}
                loading={isSaving}
              />
            </>
          ) : (
            <Button
              intent={Intent.PRIMARY}
              text="Edit Profile"
              onClick={handleEdit}
            />
          )}
        </div>
      </Card>
    </div>
  )
}