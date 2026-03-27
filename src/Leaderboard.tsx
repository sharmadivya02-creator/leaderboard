import { Trophy } from 'lucide-react';
import './Leaderboard.css';

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Type definitions
interface TeamData {
  id: string;
  name: string;
  time: string;
}

// Convert absolute milliseconds format (if it represents that) to a MM:SS.ms string
// Adapt depending on whether the DB stores ms or seconds
function formatTime(ms: number | null): string {
  if (ms == null) return '--:--.---';
  // If we suspect ms is actually seconds based on usage: 
  // (Assuming it's milliseconds typically for racing games)
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

export function Leaderboard() {
  const [data, setData] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, () => {
        fetchScores();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchScores() {
    try {
      setLoading(true);
      const { data: scores, error } = await supabase
        .from('scores')
        .select('*')
        // Order by Time ascending (assuming lower time is better)
        .order('Time', { ascending: true });

      if (error) throw error;

      if (scores) {
        const formattedData: TeamData[] = scores.map((row: any) => ({
          id: row.id.toString(),
          name: row.player_name || 'Unknown',
          time: formatTime(row.Time),
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">
          <Trophy size={40} color="#fbbf24" />
          Team Rankings
        </h1>
        <p className="leaderboard-subtitle">Top Teams</p>
      </div>

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading scores...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                  No scores yet!
                </td>
              </tr>
            ) : (
              data.map((team, index) => {
              const rank = index + 1;
              const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';

              return (
                <tr key={team.id} className={`leaderboard-row ${rankClass}`}>
                  <td className="rank-cell">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </td>
                  <td>
                    <div className="player-info">
                      <div className="player-avatar">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="player-name">{team.name}</span>
                    </div>
                  </td>
                  <td className="score-cell">
                    {team.time}
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
