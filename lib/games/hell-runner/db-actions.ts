'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveGameProgress(
  userId: string,
  door: number,
  stage: number,
  deaths: number,
  time: number
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hell_runner_progress')
    .upsert(
      {
        user_id: userId,
        current_door: door,
        current_stage: stage,
        total_deaths: deaths,
        best_time: time,
        updated_at: new Date(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving game progress:', error);
    return { error: 'Failed to save progress' };
  }

  return { data };
}

export async function getGameProgress(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hell_runner_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching game progress:', error);
    return { error: 'Failed to fetch progress' };
  }

  return { data };
}

export async function saveLeaderboardEntry(
  userId: string,
  door: number,
  stage: number,
  time: number,
  deaths: number
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hell_runner_leaderboard')
    .insert({
      user_id: userId,
      door,
      stage,
      time_seconds: time,
      death_count: deaths,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving leaderboard entry:', error);
    return { error: 'Failed to save leaderboard' };
  }

  return { data };
}

export async function getLeaderboard(door: number, stage: number, limit = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hell_runner_leaderboard')
    .select('*')
    .eq('door', door)
    .eq('stage', stage)
    .order('time_seconds', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return { error: 'Failed to fetch leaderboard' };
  }

  return { data };
}
