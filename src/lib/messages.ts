/**
 * Pure message-template helpers.
 *
 * Kept free of any server imports (no database, no `pg`) so client components
 * such as the customer booking lookup can use them.
 */

/** Replaces {placeholders} in a template with real values. */
export function fillMessage(
  template: string,
  values: Record<string, string | null | undefined>,
): string {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue;
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}
