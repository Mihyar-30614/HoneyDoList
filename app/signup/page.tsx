'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await signUp(email, password)
      router.push('/home')
    } catch (error) {
      setError('Failed to create an account')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      router.push('/home')
    } catch (error) {
      setError('Failed to sign in with Google')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem',
      background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
    }}>
      <div className="card" style={{ 
        maxWidth: '28rem', 
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-block',
              marginBottom: '1rem',
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            ← Back to Home
          </Link>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: 'var(--primary-color)',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </h1>
          <p style={{ color: '#6B7280' }}>
            Join HoneyDos to start managing your tasks
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '0.875rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '0.375rem',
            backgroundColor: 'var(--google-color)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            transition: 'background-color 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          color: '#6B7280'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ padding: '0 1rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        <form onSubmit={handleSubmit} className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div className="form-control" style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-control" style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              placeholder="Create a password"
            />
          </div>

          <div className="form-control" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ color: '#6B7280', marginBottom: '0.5rem' }}>
            Already have an account?
          </p>
          <Link 
            href="/login" 
            style={{ 
              color: 'var(--primary-color)',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  )
} 