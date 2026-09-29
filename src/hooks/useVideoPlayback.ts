"use client";

import { useSyncExternalStore } from "react";
import { getServerVideoPlayback, getVideoPlayback, subscribeVideoPlayback } from "@/lib/video-coordination";

export function useVideoPlayback() {
  return useSyncExternalStore(subscribeVideoPlayback, getVideoPlayback, getServerVideoPlayback);
}
