"use client";

import { getApiBaseUrl } from "./socialAuthStorage";

export const buildUserName = (firstName, lastName, fallback) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return fullName || fallback;
};

export const persistSocialSession = async (payload) => {
  const response = await fetch(`${getApiBaseUrl()}/auth/social-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to persist social session");
  }

  const data = await response.json();

  return data.session;
};
