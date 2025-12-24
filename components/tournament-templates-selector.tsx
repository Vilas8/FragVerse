'use client';

import { useState } from 'react';
import { TournamentTemplate, TemplateCategory } from '@/app/types/tournament-templates';
import { templateCategories } from '@/lib/tournament-templates';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle, CyberBadge } from '@/components/ui/cyber-card';
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

const categoryColors: Record<string, 'cyan' | 'purple' | 'pink' | 'gold'> = {
  quick: 'cyan',
  competitive: 'purple',
  casual: 'pink',
  championship: 'gold',
  custom: 'cyan',
};

export default function TournamentTemplatesSelector({
  onSelectTemplate,
  selectedTemplateId,
}: TournamentTemplatesSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('competitive');

  const renderTemplateCard = (template: TournamentTemplate) => {
    const isSelected = selectedTemplateId === template.id;
    const categoryColor = categoryColors[selectedCategory] || 'cyan';

    return (
      <CyberCard
        key={template.id}
        variant={isSelected ? categoryColor : 'default'}
        glow={isSelected}
        hover
        className={`cursor-pointer group relative ${
          isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-950' : ''
        }`}
        onClick={() => onSelectTemplate(template)}
      >
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 animate-pulse" />
              <CyberBadge variant="cyan" className="relative">
                <Check className="h-3 w-3 mr-1" />
                SELECTED
              </CyberBadge>
            </div>
          </div>
        )}

        <CyberCardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="text-4xl animate-float">{template.icon}</div>
            <div className="flex-1">
              <CyberCardTitle className="text-lg mb-2" glow={isSelected}>
                {template.name}
              </CyberCardTitle>
              <p className="text-sm text-cyan-100/60">{template.description}</p>
            </div>
          </div>
        </CyberCardHeader>

        <CyberCardContent className="space-y-4">
          {/* Primary Stats */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Users className="h-3 w-3 text-cyan-400" />
              <span className="text-xs font-semibold text-white">
                {template.settings.minPlayers}-{template.settings.maxPlayers}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Trophy className="h-3 w-3 text-purple-400" />
              <span className="text-xs font-semibold text-white">
                {template.settings.format.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-lg">
              <Clock className="h-3 w-3 text-pink-400" />
              <span className="text-xs font-semibold text-white">
                {template.settings.estimatedDuration}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {template.settings.matchFormat && (
              <CyberBadge variant="purple" className="text-xs">
                {template.settings.matchFormat}
              </CyberBadge>
            )}
            {template.settings.playerType === 'team' && (
              <CyberBadge variant="cyan" className="text-xs">
                {template.settings.teamSize}v{template.settings.teamSize}
              </CyberBadge>
            )}
            {template.settings.prizePoolEnabled && (
              <CyberBadge variant="gold" className="text-xs">
                💰 Prize Pool
              </CyberBadge>
            )}
            {template.settings.streamingEnabled && (
              <CyberBadge variant="pink" className="text-xs">
                📹 Streaming
              </CyberBadge>
            )}
            {template.settings.enableScheduling && (
              <CyberBadge variant="cyan" className="text-xs">
                📅 Scheduled
              </CyberBadge>
            )}
          </div>

          {/* Game Presets */}
          {template.gamePresets && (
            <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1">
                <GamepadIcon className="h-3 w-3" />
                {template.gamePresets.game} PRESET
              </p>
              {template.gamePresets.mapPool && (
                <p className="text-xs text-cyan-100/60">
                  Maps: {template.gamePresets.mapPool.join(', ')}
                </p>
              )}
            </div>
          )}
        </CyberCardContent>
      </CyberCard>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-black flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50" />
            <Sparkles className="h-7 w-7 text-cyan-400 relative animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Choose Tournament Template
          </span>
        </h2>
        <p className="text-sm text-cyan-100/60">
          Select a pre-configured template to quickly set up your tournament, or customize settings in the next step.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 p-1">
          {templateCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all"
            >
              {categoryIcons[category.id]}
              <span className="hidden sm:inline font-bold">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {templateCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            {/* Category Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl">
              <h3 className="font-bold text-xl text-white mb-1 flex items-center gap-2">
                {categoryIcons[category.id]}
                {category.name}
              </h3>
              <p className="text-sm text-cyan-100/70">{category.description}</p>
            </div>

            {/* Templates Grid */}
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {category.templates.map(renderTemplateCard)}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selection Confirmation */}
      {selectedTemplateId && (
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-xl backdrop-blur-sm animate-slide-up">
          <p className="text-sm font-bold text-white flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 animate-pulse" />
              <Check className="h-5 w-5 text-cyan-400 relative" />
            </div>
            Template selected! Customize the settings in the next step.
          </p>
        </div>
      )}
    </div>
  );
}
