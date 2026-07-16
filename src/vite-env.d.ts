/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Deployed Google Apps Script Web App URL (ends with /exec). */
  readonly VITE_APPS_SCRIPT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
