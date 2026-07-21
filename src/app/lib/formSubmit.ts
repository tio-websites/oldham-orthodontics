/**
 * PRM form submission helper.
 *
 * Two modes (see .env.example):
 *   PROXIED (default in production — NEXT_PUBLIC_PRM_PROXY_BASE set, e.g. "/api/prm"):
 *     forms POST same-origin to the site's own /api/prm/* route handlers, which
 *     inject the TDS-API-KEY server-side. NO key ships to the browser.
 *   DIRECT (fallback — NEXT_PUBLIC_PRM_PROXY_BASE unset): posts straight to
 *     prm.tio.work with the NEXT_PUBLIC_TDS_API_KEY header (key is public).
 *
 * Honeypot fields ("oo_hp_a", "oo_hp_b") short-circuit submission silently so
 * bots get a "success" response without a lead being created.
 *
 * Env vars (injected at build time):
 *   NEXT_PUBLIC_PRM_PROXY_BASE – same-origin proxy base (e.g. "/api/prm"); when
 *                                set, proxied mode is used and no key is needed here.
 *   NEXT_PUBLIC_PRM_ENDPOINT   – full v4-tds endpoint URL (direct mode only)
 *   NEXT_PUBLIC_TDS_API_KEY    – account-level API key (direct mode only)
 *   NEXT_PUBLIC_PRM_ACCOUNT_ID – account id (used for file uploads, both modes)
 */

export interface SubmitResult {
  success: boolean;
  error?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  name?: string;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// Trim any trailing slash — Oldham uses the Next default trailingSlash:false, so
// the route handlers answer at the bare path (a trailing slash would 308-redirect
// and break the POST).
const PROXY_BASE = (process.env.NEXT_PUBLIC_PRM_PROXY_BASE || "").replace(
  /\/+$/,
  "",
);
const PROXIED = PROXY_BASE.length > 0;

/**
 * Resolves the submit + upload endpoints and the key header for the active mode.
 * Returns null when config is missing (direct mode with no key/endpoint).
 */
function resolveConfig():
  | { submitUrl: string; uploadUrl: string; keyHeader: Record<string, string> }
  | null {
  if (PROXIED) {
    return {
      submitUrl: `${PROXY_BASE}/xcms-to-prm-v4-tds`,
      uploadUrl: `${PROXY_BASE}/v2/upload-file`,
      keyHeader: {}, // proxy injects TDS-API-KEY server-side
    };
  }
  const endpoint = process.env.NEXT_PUBLIC_PRM_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_TDS_API_KEY;
  if (!endpoint || !apiKey) return null;
  return {
    submitUrl: endpoint,
    uploadUrl: endpoint.replace("/api/xcms-to-prm-v4-tds", "") + "/api/v2/upload-file",
    keyHeader: { "TDS-API-KEY": apiKey },
  };
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const cfg = resolveConfig();
  const accountId = process.env.NEXT_PUBLIC_PRM_ACCOUNT_ID;

  if (!cfg || !accountId) {
    return { success: false, error: "Upload configuration missing" };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: `${file.name} exceeds 10MB limit` };
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("accountid", accountId);

  try {
    const response = await fetch(cfg.uploadUrl, {
      method: "POST",
      headers: cfg.keyHeader,
      body: fd,
    });
    if (!response.ok) {
      return { success: false, error: `Upload failed (${response.status})` };
    }
    const data = (await response.json()) as {
      success?: boolean;
      url?: string;
      name?: string;
    };
    if (data && data.success && data.url) {
      return { success: true, url: data.url, name: data.name ?? file.name };
    }
    return { success: false, error: "Upload rejected by server" };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? `Upload error: ${err.message}` : "Upload error",
    };
  }
}

// Generic names so password managers / autofill don't trip them.
const HONEYPOT_FIELDS = ["oo_hp_a", "oo_hp_b"];

export async function submitPrmForm(
  form: HTMLFormElement,
): Promise<SubmitResult> {
  const cfg = resolveConfig();

  if (!cfg) {
    return { success: false, error: "Form configuration missing" };
  }

  for (const name of HONEYPOT_FIELDS) {
    const field = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (field && field.value) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[formSubmit] honeypot "${name}" tripped (value: ${JSON.stringify(field.value)}). Skipping PRM.`,
        );
      }
      return { success: true };
    }
  }

  const formData = new FormData(form);
  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    if (!HONEYPOT_FIELDS.includes(key)) {
      params.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(cfg.submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...cfg.keyHeader,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        success: false,
        error: `PRM ${response.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Network error",
    };
  }
}
