export const VIDEO_SOUND_EVENT = "xrish:video-sound";

export function claimVideoSound(source: string) {
  window.dispatchEvent(new CustomEvent(VIDEO_SOUND_EVENT, { detail: { source } }));
}
