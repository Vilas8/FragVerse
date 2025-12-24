'use client';

import { useState } from 'react';
import { TournamentTemplate, TemplateCategory } from '@/app/types/tournament-templates';
import { templateCategories } from '@/lib/tournament-templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  Users,
  Clock,
  Sparkles,
  Zap,
  Target,
  GamepadIcon,
  Crown,
  Settings,
  Check,
} from 'lucide-react';

interface TournamentTemplatesSelectorProps {
  onSelectTemplate: (template: TournamentTemplate) => void;
  selectedTemplateId?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  quick: <Zap className="h-4 w-4" />,
  competitive: <Target className="h-4 w-4" />,
  casual: <GamepadIcon className="h-4 w-4" />,
  championship: <Crown className="h-4 w-4" />,
  custom: <Settings className="h-4 w-4" />,
};

export default function TournamentTemplatesSelector({
  onSelectTemplate,
  selectedTemplateId,
}: TournamentTemplatesSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('competitive');

  const renderTemplateCard = (template: TournamentTemplate) => {
    const isSelected = selectedTemplateId === template.id;

    return (
      <Card
        key={template.id}
        className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary ${
          isSelected ? 'border-primary border-2 bg-primary/5' : ''
        }`}
        onClick={() => onSelectTemplate(template)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{template.icon}</span>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </div>
            {isSelected && (
              <Badge variant="default" className="ml-2">
                <Check className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm">{template.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {template.settings.minPlayers}-{template.settings.maxPlayers} players
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Trophy className="h-3 w-3 mr-1" />
              {template.settings.format.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {template.settings.estimatedDuration}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.settings.matchFormat && (
              <Badge variant="secondary" className="text-xs">
                {template.settings.matchFormat}
              </Badge>
            )}
            {template.settings.playerType === 'team' && (
              <Badge variant="secondary" className="text-xs">
                {template.settings.teamSize}v{template.settings.teamSize}
              </Badge>
            )}
            {template.settings.prizePoolEnabled && (
              <Badge variant="secondary" className="text-xs">
                💰 Prize Pool
              </Badge>
            )}
            {template.settings.streamingEnabled && (
              <Badge variant="secondary" className="text-xs">
                📹 Streaming
              </Badge>
            )}
            {template.settings.enableScheduling && (
              <Badge variant="secondary" className="text-xs">
                📅 Scheduled
              </Badge>
            )}
          </div>

          {template.gamePresets && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p className="text-xs font-semibold mb-1">🎮 {template.gamePresets.game} Preset</p>
              {template.gamePresets.mapPool && (
                <p className="text-xs text-muted-foreground">
                  Maps: {template.gamePresets.mapPool.join(', ')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Choose a Tournament Template
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a pre-configured template to quickly set up your tournament, or start with a custom
          template for full control.
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          {templateCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              {categoryIcons[category.id]}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {templateCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.templates.map(renderTemplateCard)}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {selectedTemplateId && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            Template selected! You can customize the settings in the next step.
          </p>
        </div>
      )}
    </div>
  );
}
