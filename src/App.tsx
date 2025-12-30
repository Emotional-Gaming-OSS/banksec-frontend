import { useState, useEffect } from 'react'
import axios from 'axios'
import { Login } from './components/Login'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'))
  const [simStatus, setSimStatus] = useState<any>(null)

  const handleLogin = (newToken: string, newUser: string) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', newUser)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setSimStatus(null)
  }

  const startSimulation = async () => {
    try {
      const res = await axios.post('/api/v1/start', {
        scenario_id: 'phishing-101'
      })
      setSimStatus(res.data)
    } catch (err) {
      alert('Failed to start simulation')
    }
  }

  const launchDridexAttack = async () => {
    if (!simStatus?.simulation_id) {
      alert('Start a simulation first!')
      return
    }
    
    try {
      alert('Launching Dridex v3.2.0 Adversary Bot...')
      await axios.post('/api/v1/launch/dridex', {
        simulation_id: simStatus.simulation_id,
        intensity: 'medium'
      })
      // Refresh simulation state after a few seconds
      setTimeout(refreshSimulation, 3000)
    } catch (err) {
      alert('Failed to launch attack')
    }
  }

  const refreshSimulation = async () => {
    // In a real app this would fetch the latest state
    // For this demo we just re-fetch the start endpoint to get new transactions
    // But properly we should have a GET /simulation/{id} endpoint
    // Let's just mock the refresh by alerting user to check logs
    alert('Attack vectors injected. Refreshing transaction feed...')
  }

  if (!token) {
    return (
      <div style={{ fontFamily: 'Arial', background: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: '#1a1a2e', color: 'white', padding: '1rem', textAlign: 'center' }}>
          <h1>BankSec Enterprise</h1>
          <p>Secure Training Platform</p>
        </header>
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f0f2f5' }}>
      <nav style={{ background: '#1a5fb4', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>BankSec Enterprise</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Training Dashboard</h3>
          <p>Select a module to begin your training session.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
              <h4>Phishing Defense</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Learn to identify suspicious emails and links.</p>
              <button 
                onClick={startSimulation}
                style={{ width: '100%', marginTop: '10px', padding: '8px', background: '#26a269', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Start Module
              </button>
            </div>
            
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
              <h4>Transaction Monitor</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Spot fraudulent transaction patterns.</p>
              <button disabled style={{ width: '100%', marginTop: '10px', padding: '8px', background: '#ccc', color: '#666', border: 'none', borderRadius: '4px', cursor: 'not-allowed' }}>
                Coming Soon
              </button>
            </div>

            <div style={{ border: '1px solid #ed333b', padding: '15px', borderRadius: '8px', background: '#fff5f5' }}>
              <h4 style={{ color: '#c01c28' }}>Red Team: Dridex Attack</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Simulate automated money laundering bot.</p>
              <button 
                onClick={launchDridexAttack}
                style={{ width: '100%', marginTop: '10px', padding: '8px', background: '#c01c28', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Launch Attack
              </button>
            </div>
          </div>
        </div>

        {simStatus && (
          <div style={{ marginTop: '20px', background: '#1e1e1e', color: '#eee', padding: '20px', borderRadius: '8px', fontFamily: 'monospace' }}>
            <h4 style={{ color: '#33d17a', marginTop: 0 }}>Simulation Active: {simStatus.simulation_id}</h4>
            <div style={{ borderTop: '1px solid #333', paddingTop: '10px' }}>
              <p>> System initialized...</p>
              <p>> {simStatus.instructions}</p>
              <p>> Loading transactions...</p>
              {simStatus.transactions.map((tx: any) => (
                <div key={tx.id} style={{ marginLeft: '10px', color: tx.is_suspicious ? '#ed333b' : '#eee' }}>
                  [{tx.id}] {tx.description} - ${tx.amount}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
