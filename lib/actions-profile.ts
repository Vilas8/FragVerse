// Profile-specific actions
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function UpdateUsername(username: string, userid: string) {
  try {
    const supabase = await createClient();
    
    // Validate username
    if (username.length < 4 || username.length > 20) {
      return {
        success: false,
        error: 'Username must be between 4 and 20 characters'
      };
    }

    // Check if username is already taken
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .neq('id', userid)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'Username is already taken'
      };
    }

    // Update username in users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ username })
      .eq('id', userid);

    if (updateError) {
      console.error('Error updating username:', updateError);
      return {
        success: false,
        error: 'Failed to update username'
      };
    }

    // Revalidate profile page
    revalidatePath('/profile');
    revalidatePath('/profile/[userId]', 'page');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error in UpdateUsername:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
