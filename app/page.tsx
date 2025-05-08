'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
          Welcome to Honey Do List
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6B7280', marginBottom: '2rem' }}>
          Your sweet solution for managing tasks and projects
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/signup" className="btn btn-outline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
} 