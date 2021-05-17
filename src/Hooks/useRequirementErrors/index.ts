import { useEffect, useState } from 'preact/hooks';

import { useMicrophone, useSpeech } from '@Hooks';

export const useRequirementErrors = (): string[] => {
  const microphone = useMicrophone();
  const speech = useSpeech();

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const nextErrors: string[] = [];

    if (microphone.error) nextErrors.push(microphone.error);
    if (speech.error) nextErrors.push(speech.error);
    nextErrors.push('Hey there adamım! Bu bir hatadır eller havaya!');

    setErrors(nextErrors);
  }, [microphone, speech]);

  return errors;
};