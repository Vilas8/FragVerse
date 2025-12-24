'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InfoIcon, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitTournament } from '@/lib/actions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import TournamentTemplatesSelector from './tournament-templates-selector';
import { TournamentTemplate } from '@/app/types/tournament-templates';
import { Badge } from './ui/badge';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(3000, 'Description must be 3000 characters or less')
    .optional(),
  maxPlayers: z
    .number()
    .int()
    .min(3, 'Maximum must be at least 3 players')
    .max(1000, 'Maximum 1000 players')
    .optional(),
  isPrivate: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TournamentFormModalProps {
  user: { id: string } | null;
}

export default function TournamentFormModal({
  user,
}: TournamentFormModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] =
    useState<TournamentTemplate | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      maxPlayers: undefined,
      isPrivate: false,
    },
  });

  const handleTemplateSelect = (template: TournamentTemplate) => {
    setSelectedTemplate(template);
    // Pre-fill form with template settings
    form.setValue('maxPlayers', template.settings.maxPlayers);
    form.setValue('isPrivate', !template.settings.isPublic);
  };

  const handleNext = () => {
    if (selectedTemplate) {
      setStep('details');
    } else {
      toast({
        title: 'Select a Template',
        description: 'Please select a tournament template to continue',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    setStep('template');
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add template metadata
    if (selectedTemplate) {
      formData.append('templateId', selectedTemplate.id);
      formData.append('templateName', selectedTemplate.name);
    }

    const response = await submitTournament(formData);

    if (response?.success) {
      setOpen(false);
      setStep('template');
      setSelectedTemplate(null);
      router.push(`/tournaments/${response.tournamentId}`);
      toast({
        title: 'Tournament Created',
        description: 'New tournament has been created successfully',
      });
    }
    if (response?.error) {
      toast({
        title: 'Error',
        description: response.error,
      });
    }
    form.reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset when closing
      setStep('template');
      setSelectedTemplate(null);
      form.reset();
    }
  };

  return (
    <>
      {user && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" /> Create Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {step === 'template'
                  ? 'Create Tournament - Choose Template'
                  : 'Create Tournament - Tournament Details'}
              </DialogTitle>
              <DialogDescription>
                {step === 'template'
                  ? 'Select a pre-configured template or start with a custom setup'
                  : 'Fill in the details to create your tournament'}
              </DialogDescription>
            </DialogHeader>

            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-2 pb-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === 'template'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                1
              </div>
              <div className="w-16 h-0.5 bg-muted" />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === 'details'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
            </div>

            {/* Step 1: Template Selection */}
            {step === 'template' && (
              <div className="space-y-4">
                <TournamentTemplatesSelector
                  onSelectTemplate={handleTemplateSelect}
                  selectedTemplateId={selectedTemplate?.id}
                />
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} disabled={!selectedTemplate}>
                    Next: Enter Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Tournament Details */}
            {step === 'details' && selectedTemplate && (
              <div className="space-y-4">
                {/* Template Info Banner */}
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedTemplate.icon}</span>
                      <div>
                        <h3 className="font-semibold">
                          {selectedTemplate.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      type="button"
                    >
                      Change Template
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">
                      {selectedTemplate.settings.format.replace('-', ' ')}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedTemplate.settings.minPlayers}-
                      {selectedTemplate.settings.maxPlayers} players
                    </Badge>
                    <Badge variant="secondary">
                      {selectedTemplate.settings.matchFormat}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedTemplate.settings.estimatedDuration}
                    </Badge>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tournament Name{' '}
                            <span className="text-xs align-super text-destructive">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`e.g., ${selectedTemplate.name} - December 2025`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add rules, prizes, schedule, or any other important information..."
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxPlayers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Players</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Recommended: {selectedTemplate.settings.minPlayers}-
                            {selectedTemplate.settings.maxPlayers} players
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <div className="flex items-center space-x-2">
                              <FormLabel>Make private</FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="w-[400px]">
                                    <p>
                                      Private tournaments can only be found by
                                      direct link.
                                    </p>
                                    <p>
                                      Accessible only to players who have been
                                      approved to join by the creator (you).
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit">Create Tournament</Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
