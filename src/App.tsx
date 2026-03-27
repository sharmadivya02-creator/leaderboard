import { useState } from 'react'
import { Leaderboard } from './Leaderboard'
import { AddScore } from './AddScore'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'add'>('leaderboard');

  return (
    <div className="app-container">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Score
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'leaderboard' ? (
          <Leaderboard />
        ) : (
          <AddScore onSuccess={() => setActiveTab('leaderboard')} />
        )}
      </div>
    </div>
  )
}

export default App
