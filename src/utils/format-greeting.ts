import { localize } from '../localize/localize';
import type { TranslationKey } from '../localize/en';

/** Time-of-day greeting period for the Home toolbar. */
export type GreetingPeriod = 'morning' | 'noon' | 'evening' | 'night';

const GREETING_KEYS: Record<GreetingPeriod, TranslationKey> = {
  morning: 'home.greeting.morning',
  noon: 'home.greeting.noon',
  evening: 'home.greeting.evening',
  night: 'home.greeting.night',
};

/**
 * Map local hour to greeting period.
 * Morning 5–11, noon 12–16, evening 17–20, night 21–4.
 */
export function greetingPeriod(ms: number): GreetingPeriod {
  const hour = new Date(ms).getHours();
  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'noon';
  if (hour >= 17 && hour <= 20) return 'evening';
  return 'night';
}

/** Localized greeting for the given instant (greeting text only, no name). */
export function formatGreeting(
  ms: number,
  language: string | undefined,
): string {
  return localize(language, GREETING_KEYS[greetingPeriod(ms)]);
}
