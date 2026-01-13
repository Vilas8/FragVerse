import { IPLPlayer, TEAM_RULES } from '@/types/frag11';

export interface TeamValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TeamComposition {
  wicketKeepers: number;
  batters: number;
  allRounders: number;
  bowlers: number;
  totalPlayers: number;
  totalCredits: number;
  team1Count: number;
  team2Count: number;
}

/**
 * Get team composition from selected players
 */
export function getTeamComposition(
  players: IPLPlayer[],
  team1Id?: string,
  team2Id?: string
): TeamComposition {
  const composition = {
    wicketKeepers: 0,
    batters: 0,
    allRounders: 0,
    bowlers: 0,
    totalPlayers: players.length,
    totalCredits: 0,
    team1Count: 0,
    team2Count: 0,
  };

  players.forEach(player => {
    // Count by role
    switch (player.role) {
      case 'WK':
        composition.wicketKeepers++;
        break;
      case 'BAT':
        composition.batters++;
        break;
      case 'AR':
        composition.allRounders++;
        break;
      case 'BOWL':
        composition.bowlers++;
        break;
    }

    // Count credits (optional now, just for display)
    composition.totalCredits += player.credits;

    // Count by team
    if (team1Id && player.team_id === team1Id) {
      composition.team1Count++;
    } else if (team2Id && player.team_id === team2Id) {
      composition.team2Count++;
    }
  });

  return composition;
}

/**
 * Validate team composition
 */
export function validateTeam(
  players: IPLPlayer[],
  captainId?: string,
  viceCaptainId?: string,
  team1Id?: string,
  team2Id?: string
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const composition = getTeamComposition(players, team1Id, team2Id);

  // Check total players
  if (composition.totalPlayers < TEAM_RULES.MIN_PLAYERS) {
    errors.push(`Select at least ${TEAM_RULES.MIN_PLAYERS} players (currently ${composition.totalPlayers})`);
  } else if (composition.totalPlayers > TEAM_RULES.MAX_PLAYERS) {
    errors.push(`Maximum ${TEAM_RULES.MAX_PLAYERS} players allowed (currently ${composition.totalPlayers})`);
  }

  // Check wicket keepers
  if (composition.wicketKeepers < TEAM_RULES.MIN_WICKET_KEEPERS) {
    errors.push(`Select at least ${TEAM_RULES.MIN_WICKET_KEEPERS} wicket keeper`);
  } else if (composition.wicketKeepers > TEAM_RULES.MAX_WICKET_KEEPERS) {
    errors.push(`Maximum ${TEAM_RULES.MAX_WICKET_KEEPERS} wicket keepers allowed`);
  }

  // Check batters
  if (composition.batters < TEAM_RULES.MIN_BATTERS) {
    errors.push(`Select at least ${TEAM_RULES.MIN_BATTERS} batter`);
  } else if (composition.batters > TEAM_RULES.MAX_BATTERS) {
    errors.push(`Maximum ${TEAM_RULES.MAX_BATTERS} batters allowed`);
  }

  // Check all-rounders
  if (composition.allRounders < TEAM_RULES.MIN_ALL_ROUNDERS) {
    errors.push(`Select at least ${TEAM_RULES.MIN_ALL_ROUNDERS} all-rounder`);
  } else if (composition.allRounders > TEAM_RULES.MAX_ALL_ROUNDERS) {
    errors.push(`Maximum ${TEAM_RULES.MAX_ALL_ROUNDERS} all-rounders allowed`);
  }

  // Check bowlers
  if (composition.bowlers < TEAM_RULES.MIN_BOWLERS) {
    errors.push(`Select at least ${TEAM_RULES.MIN_BOWLERS} bowler`);
  } else if (composition.bowlers > TEAM_RULES.MAX_BOWLERS) {
    errors.push(`Maximum ${TEAM_RULES.MAX_BOWLERS} bowlers allowed`);
  }

  // Check team distribution
  if (composition.team1Count > TEAM_RULES.MAX_FROM_ONE_TEAM) {
    errors.push(`Maximum ${TEAM_RULES.MAX_FROM_ONE_TEAM} players from one team`);
  }
  if (composition.team2Count > TEAM_RULES.MAX_FROM_ONE_TEAM) {
    errors.push(`Maximum ${TEAM_RULES.MAX_FROM_ONE_TEAM} players from one team`);
  }

  // Check captain
  if (composition.totalPlayers === TEAM_RULES.MAX_PLAYERS) {
    if (!captainId) {
      errors.push('Select a captain');
    } else if (!players.find(p => p.id === captainId)) {
      errors.push('Captain must be from selected players');
    }

    // Check vice captain
    if (!viceCaptainId) {
      errors.push('Select a vice captain');
    } else if (!players.find(p => p.id === viceCaptainId)) {
      errors.push('Vice captain must be from selected players');
    } else if (viceCaptainId === captainId) {
      errors.push('Captain and vice captain must be different');
    }
  }

  // Warnings for optimal selection
  if (composition.totalPlayers >= 8 && !captainId) {
    warnings.push('Consider selecting a captain');
  }
  if (composition.totalPlayers >= 8 && !viceCaptainId) {
    warnings.push('Consider selecting a vice captain');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate projected points for a player
 */
export function calculateProjectedPoints(
  player: IPLPlayer,
  isCaptain: boolean,
  isViceCaptain: boolean
): number {
  let points = player.average_points;

  if (isCaptain) {
    points *= TEAM_RULES.CAPTAIN_MULTIPLIER;
  } else if (isViceCaptain) {
    points *= TEAM_RULES.VICE_CAPTAIN_MULTIPLIER;
  }

  return Math.round(points * 10) / 10;
}

/**
 * Get team's projected total points
 */
export function getTeamProjectedPoints(
  players: IPLPlayer[],
  captainId?: string,
  viceCaptainId?: string
): number {
  return players.reduce((total, player) => {
    const isCaptain = player.id === captainId;
    const isViceCaptain = player.id === viceCaptainId;
    return total + calculateProjectedPoints(player, isCaptain, isViceCaptain);
  }, 0);
}
