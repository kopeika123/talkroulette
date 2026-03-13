const AUTH_SESSION_STORAGE_KEY = "talkroulette-auth-session";
const VK_STATE_STORAGE_KEY = "talkroulette-vk-state";
const VK_CODE_VERIFIER_STORAGE_KEY = "talkroulette-vk-code-verifier";

const isBrowser = () => typeof window !== "undefined";

const normalizeBaseUrl = (url) => {
  return url.replace(/\/$/, "");
};

const getBrowserOrigin = () => {
  if (!isBrowser()) {
    return "";
  }

  return normalizeBaseUrl(window.location.origin);
};

export const getAuthBaseUrl = () => {
  const browserOrigin = getBrowserOrigin();

  if (browserOrigin) {
    return browserOrigin;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
  }

  return "http://localhost:3000";
};

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);
  }

  return "http://localhost:5000";
};

export const getVkRedirectUrl = () => {
  if (process.env.NEXT_PUBLIC_VK_REDIRECT_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_VK_REDIRECT_URL);
  }

  return `${getAuthBaseUrl()}/`;
};

export const getYandexRedirectUrl = () => {
  if (process.env.NEXT_PUBLIC_YANDEX_REDIRECT_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_YANDEX_REDIRECT_URL);
  }

  return `${getAuthBaseUrl()}/auth/yandex/token`;
};

export const readAuthSession = () => {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
};

export const saveAuthSession = (session) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

export const createRandomString = (length = 64) => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const bytes = new Uint8Array(length);

  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

export const saveVkAuthChallenge = ({ codeVerifier, state }) => {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(VK_STATE_STORAGE_KEY, state);
  window.sessionStorage.setItem(VK_CODE_VERIFIER_STORAGE_KEY, codeVerifier);
};

export const readVkAuthChallenge = () => {
  if (!isBrowser()) {
    return null;
  }

  const state = window.sessionStorage.getItem(VK_STATE_STORAGE_KEY);
  const codeVerifier = window.sessionStorage.getItem(VK_CODE_VERIFIER_STORAGE_KEY);

  if (!state || !codeVerifier) {
    return null;
  }

  return { state, codeVerifier };
};

export const clearVkAuthChallenge = () => {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(VK_STATE_STORAGE_KEY);
  window.sessionStorage.removeItem(VK_CODE_VERIFIER_STORAGE_KEY);
};
