import { supabase } from './supabaseClient'

// Function to add a new score
export async function addScore(username, score) {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{ username, score }])

  if (error) {
    console.error('Error inserting score:', error)
    return null
  }
  return data
}

// Function to get leaderboard data
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  return data
}
