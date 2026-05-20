/**
 * Optional progress callback used by every orchestrator in this package.
 *
 * Each orchestrator emits short tagged status messages (e.g.
 * `[completeValidatorRegistration] receipt status=success gasUsed=250628 logs=1`)
 * via this callback so callers can stream them to a console / log file /
 * UI without the SDK writing to stdout directly.
 *
 * Pass `console.log` to match the previous behavior; pass `() => {}` to
 * silence; pass anything else for custom routing.
 */
export type OnProgress = (message: string) => void;
