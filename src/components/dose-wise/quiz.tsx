"use client";

import * as React from "react";
import type { DailyCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizProps {
  quiz: DailyCard["quiz"];
}

type QuizStatus = "unanswered" | "correct" | "incorrect";

export function Quiz({ quiz }: QuizProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<QuizStatus>("unanswered");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null) return;

    const selectedIndex = quiz.options.indexOf(selectedOption);
    if (selectedIndex === quiz.answerIndex) {
      setStatus("correct");
    } else {
      setStatus("incorrect");
    }
  };

  const isSubmitted = status !== "unanswered";

  const getOptionClass = (index: number) => {
    if (!isSubmitted) return "";
    if (index === quiz.answerIndex) return "text-green-600 dark:text-green-500 font-bold";
    if (index === quiz.options.indexOf(selectedOption!)) return "text-red-600 dark:text-red-500 line-through";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Test Your Knowledge</h3>
      <p className="text-muted-foreground">{quiz.question}</p>
      <form onSubmit={handleSubmit}>
        <RadioGroup
          value={selectedOption || undefined}
          onValueChange={setSelectedOption}
          className="space-y-2"
          disabled={isSubmitted}
        >
          {quiz.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className={cn("cursor-pointer", getOptionClass(index))}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {!isSubmitted && (
          <Button type="submit" className="mt-4 w-full" disabled={selectedOption === null}>
            Submit Answer
          </Button>
        )}
      </form>

      {isSubmitted && (
        <Alert variant={status === 'correct' ? 'default' : 'destructive'} className={cn('mt-4', status === 'correct' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800')}>
            {status === 'correct' ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" /> : <XCircle className="h-4 w-4 text-red-600 dark:text-red-500"/>}
          <AlertTitle className={cn(status === 'correct' ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300")}>
            {status === "correct" ? "Correct!" : "Incorrect"}
          </AlertTitle>
          <AlertDescription className={cn(status === 'correct' ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
            {status === "correct"
              ? "Great job! You're on the right track."
              : `The correct answer was: ${quiz.options[quiz.answerIndex]}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
