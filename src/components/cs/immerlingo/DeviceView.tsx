"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * One view setting shared by every interactive figure in the chapter:
 * switching device, tablet orientation or annotations on any card switches
 * them all (the reader is comparing the same product across screens).
 */
export type Device = "d" | "t" | "m";
export type Orientation = "l" | "p";

type DeviceViewState = {
  device: Device;
  orientation: Orientation;
  annotations: boolean;
  setDevice: (d: Device) => void;
  setOrientation: (o: Orientation) => void;
  setAnnotations: (on: boolean) => void;
};

const Ctx = createContext<DeviceViewState | null>(null);

export function DeviceViewProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<Device>("d");
  const [orientation, setOrientation] = useState<Orientation>("l");
  const [annotations, setAnnotations] = useState(true);
  const value = useMemo(
    () => ({ device, orientation, annotations, setDevice, setOrientation, setAnnotations }),
    [device, orientation, annotations],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDeviceView() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDeviceView must be used inside DeviceViewProvider");
  return v;
}
