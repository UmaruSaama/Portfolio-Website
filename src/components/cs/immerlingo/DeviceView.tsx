"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * One view setting shared by every interactive figure in the chapter:
 * switching device, tablet orientation or annotations on any card switches
 * them all (the reader is comparing the same product across screens).
 *
 * Until the reader picks a device, the figures open on the screen that
 * matches their own: desktop at >= 1024px, phone below. Once they pick
 * one (D, T or M), that choice holds at every width, so a reviewer on a
 * phone can still look at the desktop and tablet screens.
 */
export type Device = "d" | "t" | "m";
export type Orientation = "l" | "p";

type DeviceViewState = {
  device: Device;
  orientation: Orientation;
  annotations: boolean;
  /** Viewport is compact (< 1024px); the default device there is "m". */
  compact: boolean;
  setDevice: (d: Device) => void;
  setOrientation: (o: Orientation) => void;
  setAnnotations: (on: boolean) => void;
};

const Ctx = createContext<DeviceViewState | null>(null);

const COMPACT_QUERY = "(max-width: 1023px)";

function useCompactViewport() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

export function DeviceViewProvider({ children }: { children: ReactNode }) {
  const [chosen, setDevice] = useState<Device | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("l");
  const [annotations, setAnnotations] = useState(true);
  const compact = useCompactViewport();
  const device: Device = chosen ?? (compact ? "m" : "d");
  const value = useMemo(
    () => ({
      device,
      orientation,
      annotations,
      compact,
      setDevice,
      setOrientation,
      setAnnotations,
    }),
    [device, orientation, annotations, compact],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDeviceView() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDeviceView must be used inside DeviceViewProvider");
  return v;
}
