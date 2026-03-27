import { useState } from 'react';
import { supabase } from './supabaseClient';
import { PlusCircle } from 'lucide-react';

interface AddScoreProps {
  onSuccess: () => void;
}

export function AddScore({ onSuccess }: AddScoreProps) {
  const [teamName, setTeamName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [milliseconds, setMilliseconds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const mins = parseInt(minutes || '0', 10);
    const secs = parseInt(seconds || '0', 10);
    const ms = parseInt(milliseconds || '0', 10);

    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    if (mins === 0 && secs === 0 && ms === 0) {
      setError('Please enter a valid time greater than zero');
      return;
    }

    const totalMs = (mins * 60 * 1000) + (secs * 1000) + ms;
    
    try {
      setIsSubmitting(true);
      const { error: insertError } = await supabase
        .from('scores')
        .insert([{ player_name: teamName.trim(), Time: totalMs }]);

      if (insertError) throw insertError;
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="leaderboard-container form-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">
          <PlusCircle size={40} color="#38bdf8" />
          Add Score
        </h1>
        <p className="leaderboard-subtitle">Record a new team time</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-score-form">
        <div className="form-group">
          <label>Team Name</label>
          <input 
            type="text" 
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="e.g. CyberWarriors"
            className="form-input"
            maxLength={30}
          />
        </div>

        <div className="form-group time-inputs-group">
          <label>Time Taken (MM : SS : MS)</label>
          <div className="time-inputs">
            <input 
              type="number" 
              min="0"
              max="99"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              placeholder="00"
              className="form-input time-input"
            />
            <span className="time-separator">:</span>
            <input 
              type="number" 
              min="0"
              max="59"
              value={seconds}
              onChange={e => setSeconds(e.target.value)}
              placeholder="00"
              className="form-input time-input"
            />
            <span className="time-separator">.</span>
            <input 
              type="number" 
              min="0"
              max="999"
              value={milliseconds}
              onChange={e => setMilliseconds(e.target.value)}
              placeholder="000"
              className="form-input time-input ms-input"
            />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Adding...' : 'Submit Score'}
        </button>
      </form>
    </div>
  );
}
