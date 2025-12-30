import { useState } from 'react'
import axios from 'axios'

interface LoginProps {
  onLogin: (token: string, username: string) => void
}

export function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      if (isRegister) {
        await axios.post('/api/v1/auth/register', {
          username,
          password,
          email
        })
        // Auto login after register
        const res = await axios.post('/api/v1/auth/token', {
          username,
          password
        })
        onLogin(res.data.access_token, username)
      } else {
        const res = await axios.post('/api/v1/auth/token', {
          username,
          password
        })
        onLogin(res.data.access_token, username)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        {isRegister && (
          <div>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        )}
        
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegister ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  )
}
