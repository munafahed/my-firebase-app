
"use client";

import * as React from "react";
import type { DailyCard, Level, Track } from "@/lib/types";
import { generateDailyCardAction } from "@/app/actions";
import { LevelSelection } from "@/components/dose-wise/onboarding/level-selection";
import { TrackSelection } from "@/components/dose-wise/onboarding/track-selection";
import { DailyDoseView } from "@/components/dose-wise/daily-dose-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Terminal } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth-context";

type OnboardingStep = "track" | "level" | "dose";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Logic to allow resetting the onboarding flow for demonstration
  const startOnboarding = searchParams.get('onboarding') === 'true';

  const [step, setStep] = React.useState<OnboardingStep>("track");
  const [track, setTrack] = React.useState<Track | null>(null);
  const [level, setLevel] = React.useState<Level | null>(null);
  const [card, setCard] = React.useState<DailyCard | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize step based on onboarding status
  React.useEffect(() => {
    if (!authLoading) {
      setStep(startOnboarding ? "track" : "dose");
    }
  }, [startOnboarding, authLoading]);


  const handleTrackSelect = (selectedTrack: Track) => {
    setTrack(selectedTrack);
    setStep("level");
  };

  const handleLevelSelect = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setStep("dose");
    // Remove onboarding param from URL
    router.push('/home', { scroll: false });
  };

  React.useEffect(() => {
    if (step === "dose" && !card && !authLoading) {
      const fetchCard = async () => {
        setLoading(true);
        setError(null);
        try {
          // Default to some values if not set via onboarding
          const finalTrack = track || 'Cybersecurity';
          const finalLevel = level || 'Beginner';

          const formattedTrack = finalTrack.toLowerCase().replace(/ & /g, "/");
          const result = await generateDailyCardAction({
            track: formattedTrack,
            level: finalLevel.toLowerCase() as "beginner" | "intermediate" | "advanced",
            locale: "en",
          });

          if (result.success && result.data) {
            setCard(result.data);
          } else {
            setError(result.error || "An unknown error occurred.");
          }
        } catch (e) {
          setError("Failed to fetch daily card. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchCard();
    }
  }, [step, track, level, card, authLoading]);
  
  const renderContent = () => {
    if (authLoading) {
      return <LoadingState message="Authenticating..." />;
    }

    switch (step) {
      case "track":
        return <TrackSelection onTrackSelect={handleTrackSelect} />;
      case "level":
        return <LevelSelection onLevelSelect={handleLevelSelect} track={track!} />;
      case "dose":
        if (loading) {
          return <LoadingState message="Crafting your daily dose..." />;
        }
        if (error) {
          return <ErrorState error={error} />;
        }
        if (card) {
          return <DailyDoseView card={card} />;
        }
        return <LoadingState message="Preparing your card..." />; // Fallback loading
      default:
        return <TrackSelection onTrackSelect={handleTrackSelect} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">{renderContent()}</div>
    </main>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
       <div className="p-4 bg-primary/10 rounded-full">
         <Bot className="w-12 h-12 text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold">{message}</h2>
      <div className="w-full space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Generation Failed</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
