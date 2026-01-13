import { IPLPlayer, TeamValidation, TEAM_RULES } from '@/types/frag11';

export function validateTeam(
  players: IPLPlayer[],
  captainId: string | null,
  viceCaptainId: string | null
): TeamValidation {
  const errors: string[] = [];

  // Check total players
  if (players.length !== TEAM_RULES.TOTAL_PLAYERS) {
    errors.push(`You must select exactly ${TEAM_RULES.TOTAL_PLAYERS} players`);
  }

  // Check credits
  const totalCredits = players.reduce((sum, p) => sum + p.credits, 0);
  if (totalCredits > TEAM_RULES.TOTAL_CREDITS) {
    errors.push(`Total credits (${totalCredits.toFixed(1)}) exceed ${TEAM_RULES.TOTAL_CREDITS}`);
  }

  // Check role distribution
  const wkCount = players.filter(p => p.role === 'WK').length;
  const batCount = players.filter(p => p.role === 'BAT').length;
  const arCount = players.filter(p => p.role === 'AR').length;
  const bowlCount = players.filter(p => p.role === 'BOWL').length;

  if (wkCount < TEAM_RULES.WK_MIN || wkCount > TEAM_RULES.WK_MAX) {
    errors.push(`Wicket Keepers must be between ${TEAM_RULES.WK_MIN} and ${TEAM_RULES.WK_MAX}`);
  }
  if (batCount < TEAM_RULES.BAT_MIN || batCount > TEAM_RULES.BAT_MAX) {
    errors.push(`Batters must be between ${TEAM_RULES.BAT_MIN} and ${TEAM_RULES.BAT_MAX}`);
  }
  if (arCount < TEAM_RULES.AR_MIN || arCount > TEAM_RULES.AR_MAX) {
    errors.push(`All-Rounders must be between ${TEAM_RULES.AR_MIN} and ${TEAM_RULES.AR_MAX}`);
  }
  if (bowlCount < TEAM_RULES.BOWL_MIN || bowlCount > TEAM_RULES.BOWL_MAX) {
    errors.push(`Bowlers must be between ${TEAM_RULES.BOWL_MIN} and ${TEAM_RULES.BOWL_MAX}`);
  }

  // Check max players from same team
  const teamCounts = players.reduce((acc, p) => {
    acc[p.team_id] = (acc[p.team_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  for (const [teamId, count] of Object.entries(teamCounts)) {
    if (count > TEAM_RULES.MAX_FROM_TEAM) {
      errors.push(`Maximum ${TEAM_RULES.MAX_FROM_TEAM} players allowed from a single team`);
      break;
    }
  }

  // Check captain and vice-captain
  if (!captainId) {
    errors.push('Please select a captain');
  } else if (!players.some(p => p.id === captainId)) {
    errors.push('Captain must be from your selected players');
  }

  if (!viceCaptainId) {
    errors.push('Please select a vice-captain');
  } else if (!players.some(p => p.id === viceCaptainId)) {
    errors.push('Vice-captain must be from your selected players');
  }

  if (captainId === viceCaptainId) {
    errors.push('Captain and vice-captain must be different players');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function calculateTeamPoints(
  players: IPLPlayer[],
  captainId: string,
  viceCaptainId: string
): number {
  return players.reduce((total, player) => {
    let points = player.fantasy_points || 0;
    
    if (player.id === captainId) {
      points *= 2; // Captain gets 2x points
    } else if (player.id === viceCaptainId) {
      points *= 1.5; // Vice-captain gets 1.5x points
    }
    
    return total + points;
  }, 0);
}
