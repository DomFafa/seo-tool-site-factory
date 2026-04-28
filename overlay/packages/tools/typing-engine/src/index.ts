export type TypingResultInput = {
  prompt: string;
  typed: string;
  elapsedSeconds: number;
};

export type TypingResult = {
  wpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  errors: number;
};

export function calculateTypingResult(input: TypingResultInput): TypingResult {
  const elapsedMinutes = Math.max(input.elapsedSeconds, 1) / 60;
  let correctChars = 0;
  let incorrectChars = 0;
  const max = input.typed.length;
  for (let i = 0; i < max; i++) {
    if (input.typed[i] === input.prompt[i]) correctChars++;
    else incorrectChars++;
  }
  const wpm = Math.round((correctChars / 5) / elapsedMinutes);
  const cpm = Math.round(correctChars / elapsedMinutes);
  const accuracy = input.typed.length === 0 ? 100 : Math.max(0, Math.round((correctChars / input.typed.length) * 100));
  return { wpm, cpm, accuracy, correctChars, incorrectChars, errors: incorrectChars };
}
