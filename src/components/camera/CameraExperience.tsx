"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Photo } from "../Media";
import { stories } from "@/data/site";

function CameraFallback() {
  return (
    <div className="camera-fallback">
      <Photo frame={stories[1].cover} sizes="(max-width: 700px) 85vw, 500px" />
      <span>THROUGH OUR LENS</span>
    </div>
  );
}
class CameraBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <CameraFallback /> : this.props.children;
  }
}
const CameraCanvas = dynamic(() => import("./CameraCanvas"), {
  ssr: false,
  loading: () => <CameraFallback />,
});

export function CameraExperience() {
  const container = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const target = container.current;
    let observer: IntersectionObserver | undefined;
    const timer = setTimeout(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      if (!context) {
        setFailed(true);
        return;
      }
      context.getExtension("WEBGL_lose_context")?.loseContext();
      setEnabled(true);
    }, 120);
    if (target) {
      observer = new IntersectionObserver(
        (entries) => setVisible(entries[0].isIntersecting && !document.hidden),
        { threshold: 0 },
      );
      observer.observe(target);
    }
    const visibility = () =>
      setVisible(
        !document.hidden &&
          !!target &&
          target.getBoundingClientRect().bottom > 0,
      );
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div
      ref={container}
      className="camera-experience"
      role="img"
      aria-label="Interactive three-dimensional matte black XRISH camera"
      data-camera-state={failed ? "fallback" : enabled ? "ready" : "loading"}
    >
      <CameraBoundary>
        {enabled && !failed ? (
          <CameraCanvas
            visible={visible}
            reduced={!!reduced}
            onFailure={() => setFailed(true)}
          />
        ) : (
          <CameraFallback />
        )}
      </CameraBoundary>
    </div>
  );
}
