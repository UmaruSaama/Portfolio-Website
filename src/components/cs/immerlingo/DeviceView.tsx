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
 * On phones and tablets (viewport < 1024px) the device is pinned to "m": the phone
 * screen is the only one that reads at that width, so the device switch
 * is hidden. The reader's desktop choice is kept and returns when the
 * viewport widens.
 */
export type Device = "d" | "t" | "m";
export type Orientation = "l" | "p";

type DeviceViewState = {
  device: Device;
  orientation: Orientation;
  annotations: boolean;
  /** Viewport is phone-sized: device is pinned to "m", switch hidden. */
  phone: boolean;
  setDevice: (d: Device) => void;
  setOrientation: (o: Orientation) => void;
  setAnnotations: (on: boolean) => void;
};

const Ctx = createContext<DeviceViewState | null>(null);

const PHONE_QUERY = "(max-width: 1023px)";

function usePhoneViewport() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return phone;
}

export function DeviceViewProvider({ children }: { children: ReactNode }) {
  const [chosen, setDevice] = useState<Device>("d");
  const [orientation, setOrientation] = useState<Orientation>("l");
  const [annotations, setAnnotations] = useState(true);
  const phone = usePhoneViewport();
  const device: Device = phone ? "m" : chosen;
  const value = useMemo(
    () => ({
      device,
      orientation,
      annotations,
      phone,
      setDevice,
      setOrientation,
      setAnnotations,
    }),
    [device, orientation, annotations, phone],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDeviceView() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDeviceView must be used inside DeviceViewProvider");
  return v;
}
