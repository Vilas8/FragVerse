# Tournament Templates

FragVerse includes a comprehensive tournament template system that allows users to quickly set up tournaments with pre-configured settings.

## Features

### Pre-configured Templates

We offer 9 tournament templates across 5 categories:

#### Quick Play
- **Quick Match**: Fast 8-player single-elimination tournament (1-2 hours)

#### Competitive
- **Weekend Warrior**: 16-player competitive tournament with best-of-3 matches (3-5 hours)
- **Pro League**: 32-player professional tournament with double elimination (6-8 hours)
- **Swiss System**: Fair matchmaking tournament with similar-record opponents (5-7 hours)
- **Team Battle**: 8 teams (4v4) competing in coordinated matches (4-6 hours)
- **Free Fire Tournament**: Battle Royale preset optimized for Free Fire (3-4 hours)

#### Casual
- **Casual Fun**: Relaxed tournament for friends (2-3 hours)

#### Championship
- **Grand Championship**: 64-player major tournament with double elimination (2-3 days)

#### Custom
- **Custom Tournament**: Full customization starting from scratch

## Template Configuration

Each template includes:

### Core Settings
- **Format**: Single-elimination, double-elimination, swiss, round-robin
- **Player Type**: Solo or team-based
- **Player Limits**: Min/max participants
- **Match Format**: Best-of-1, best-of-3, or best-of-5
- **Team Size**: For team tournaments (e.g., 4v4)

### Privacy & Access
- **Public/Private**: Tournament visibility
- **Spectator Access**: Allow viewers
- **Approval Required**: Manual participant approval

### Features
- **Chat**: Integrated messaging
- **Scheduling**: Time slot management
- **Prize Pool**: Prize distribution system
- **Streaming**: Twitch/YouTube integration

### Game Presets (Optional)
- **Game Name**: Specific game configuration
- **Rules**: Pre-defined rule sets
- **Map Pool**: Available maps for the tournament

### Scheduling Options
- **Time Slots**: Allow scheduled match times
- **Match Duration**: Expected match length (minutes)
- **Break Between Matches**: Rest period (minutes)

## API Endpoints

### Get All Templates
```
GET /api/templates
```

Response:
```json
{
  "templates": [...],
  "categories": [...],
  "count": 9
}
```

### Get Template by ID
```
GET /api/templates?id=quick-match
```

Response:
```json
{
  "template": {
    "id": "quick-match",
    "name": "Quick Match",
    ...
  }
}
```

### Get Templates by Category
```
GET /api/templates?category=competitive
```

Response:
```json
{
  "templates": [...],
  "count": 5
}
```

## Usage in Components

### Import Template Functions
```typescript
import { tournamentTemplates, getTemplateById } from '@/lib/tournament-templates';
```

### Using the Template Selector Component
```tsx
import TournamentTemplatesSelector from '@/components/tournament-templates-selector';

function MyComponent() {
  const handleSelectTemplate = (template: TournamentTemplate) => {
    // Apply template settings to your tournament form
    console.log('Selected template:', template);
  };

  return (
    <TournamentTemplatesSelector
      onSelectTemplate={handleSelectTemplate}
      selectedTemplateId={selectedId}
    />
  );
}
```

## Customization

Users can:
1. **Select a template** to start with pre-configured settings
2. **Modify settings** after selection to customize their tournament
3. **Create custom** tournaments from scratch

## Future Enhancements

### Planned Features
- User-created template saving
- Community template sharing
- Template versioning
- Advanced game-specific presets
- Tournament history-based suggestions

### Additional Tournament Formats
- Round-robin tournaments
- Group stage + playoffs
- Ladder/ranking systems
- Seasonal leagues

## File Structure

```
FragVerse/
├── app/
│   ├── types/
│   │   └── tournament-templates.ts    # TypeScript types
│   └── api/
│       └── templates/
│           └── route.ts                # API endpoints
├── lib/
│   └── tournament-templates.ts         # Template configurations
├── components/
│   └── tournament-templates-selector.tsx  # UI component
└── docs/
    └── TOURNAMENT_TEMPLATES.md         # This documentation
```

## Contributing

To add a new template:

1. Add template configuration to `lib/tournament-templates.ts`
2. Update the `tournamentTemplates` array
3. Assign appropriate category
4. Test with the selector component
5. Update this documentation

## Support

For questions or issues:
- Open an issue on GitHub
- Check existing templates for examples
- Review the TypeScript types for available options
