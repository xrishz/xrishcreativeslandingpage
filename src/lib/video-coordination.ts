export const VIDEO_SOUND_EVENT = "xrish:video-sound";

export type VideoPlaybackState = { active: string | null; hasPlayed: boolean };
const initialPlaybackState: VideoPlaybackState = { active: null, hasPlayed: false };
let playbackState = initialPlaybackState;
const listeners = new Set<() => void>();

export const subscribeVideoPlayback = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getVideoPlayback = () => playbackState;
export const getServerVideoPlayback = () => initialPlaybackState;

export function claimVideoPlayback(source: string) {
  if (playbackState.active !== source || !playbackState.hasPlayed) {
    playbackState = { active: source, hasPlayed: true };
    listeners.forEach((listener) => listener());
  }
  claimVideoSound(source);
}

export function releaseVideoPlayback(source: string) {
  if (playbackState.active !== source) return;
  playbackState = { ...playbackState, active: null };
  listeners.forEach((listener) => listener());
}

export function claimVideoSound(source: string) {
  window.dispatchEvent(new CustomEvent(VIDEO_SOUND_EVENT, { detail: { source } }));
}
