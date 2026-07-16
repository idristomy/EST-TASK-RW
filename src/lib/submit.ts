import type { ApplicationValues } from "./schema";

const ENDPOINT = import.meta.env.VITE_APPS_SCRIPT_URL;

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Sends an application to the Google Apps Script Web App, which appends a row
 * to the connected Google Sheet.
 *
 * We POST with `Content-Type: text/plain` on purpose: it keeps the request a
 * CORS "simple request", so the browser skips the preflight OPTIONS call that
 * Apps Script Web Apps don't answer — while the script still receives the raw
 * JSON in `e.postData.contents`.
 */
export async function submitApplication(
  values: ApplicationValues,
): Promise<SubmitResult> {
  if (!ENDPOINT) {
    return {
      ok: false,
      error:
        "Submissions aren’t configured yet. Set VITE_APPS_SCRIPT_URL and redeploy.",
    };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(values),
      redirect: "follow",
    });

    if (!response.ok) {
      return { ok: false, error: "The server rejected the submission." };
    }

    // Apps Script returns JSON like { ok: true }. Be tolerant if parsing fails.
    try {
      const data = (await response.json()) as {
        ok?: boolean;
        duplicate?: boolean;
      };
      if (data && data.ok === false) {
        if (data.duplicate) {
          return {
            ok: false,
            error: "This email or phone number has already been used to apply.",
          };
        }
        return { ok: false, error: "The server couldn’t save your application." };
      }
    } catch {
      /* Non-JSON body but a 2xx status — treat as success. */
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Network error. Check your connection and try again.",
    };
  }
}
