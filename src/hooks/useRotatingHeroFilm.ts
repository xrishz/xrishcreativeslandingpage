"use client";

import { useSyncExternalStore } from "react";
import { previewFilms } from "@/data/site";

const STORAGE_KEY = "xrish-last-hero-film";

function chooseClientIndex() {
  if (typeof window === "undefined") return 0;

  try {
    const previous = Number.parseInt(sessionStorage.getItem(STORAGE_KEY) ?? "-1", 10);
    const offset = Math.floor(Math.random() * Math.max(previewFilms.length - 1, 1)) + 1;
    const next = Number.isInteger(previous) && previous >= 0
      ? (previous + offset) % previewFilms.length
      : Math.floor(Math.random() * previewFilms.length);
    sessionStorage.setItem(STORAGE_KEY, String(next));
    return next;
  } catch {
    return Math.floor(Math.random() * previewFilms.length);
  }
}

const clientIndex = chooseClientIndex();
const subscribe = () => () => undefined;

export function useRotatingHeroFilm() {
  const index = useSyncExternalStore(subscribe, () => clientIndex, () => 0);
  return previewFilms[index] ?? previewFilms[0];
}
