"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Group, MathUtils, Vector3 } from "three";
import { cameraConfig as config } from "./camera-config";

function CameraModel({ reduced }: { reduced: boolean }) {
  const { scene } = useGLTF(config.model);
  const group = useRef<Group>(null);
  const width = useThree((state) => state.size.width);
  const mobile = width < 480;
  const { model, center, scale } = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    return {
      model: clone,
      center: bounds.getCenter(new Vector3()).multiplyScalar(-1),
      scale: config.normalizedSize / Math.max(size.x, size.y, size.z),
    };
  }, [scene]);
  useFrame(({ pointer }, delta) => {
    if (!group.current || reduced) return;
    const targetX =
      config.rotation[0] + (mobile ? 0 : pointer.y * config.pointerRotation);
    const targetY =
      config.rotation[1] + (mobile ? 0 : pointer.x * config.pointerRotation);
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetX,
      config.damping,
      delta,
    );
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetY,
      config.damping,
      delta,
    );
  });
  return (
    <group
      ref={group}
      rotation={config.rotation}
      position={mobile ? config.mobilePosition : config.position}
      scale={scale * (mobile ? config.mobileScale : config.scale)}
    >
      <primitive object={model} position={center} />
    </group>
  );
}

function CameraLighting() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 5]} intensity={3.4} />
      <directionalLight position={[-4, 0, 2]} intensity={1.5} />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[0, 4, 3]}
          scale={[4, 1.2, 1]}
          rotation={[Math.PI / 4, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          position={[-4, 1, 2]}
          scale={[0.8, 4, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[4, 2, -2]}
          scale={[2, 5, 1]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </Environment>
    </>
  );
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}

function CameraQualityManager({
  visible,
  reduced,
}: {
  visible: boolean;
  reduced: boolean;
}) {
  const { size, setDpr, setFrameloop } = useThree();
  useEffect(() => {
    const mobile = size.width < 480;
    setDpr(
      mobile
        ? config.mobileDpr
        : Math.min(window.devicePixelRatio, config.desktopDpr),
    );
    setFrameloop(visible && !reduced && !mobile ? "always" : "demand");
  }, [size.width, setDpr, setFrameloop, visible, reduced]);
  return null;
}

export default function CameraCanvas({
  visible,
  reduced,
  onFailure,
}: {
  visible: boolean;
  reduced: boolean;
  onFailure: () => void;
}) {
  return (
    <Canvas
      dpr={[config.mobileDpr, config.desktopDpr]}
      frameloop="demand"
      camera={{ position: [0, 0.15, 6.4], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <ContextGuard onFailure={onFailure} />
      <CameraQualityManager visible={visible} reduced={reduced} />
      <Suspense fallback={null}>
        <CameraLighting />
        <CameraModel reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
