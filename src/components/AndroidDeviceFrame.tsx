import React from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  isDeviceMode: boolean;
  onToggleDeviceMode: () => void;
  overlayColor?: string;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  isDeviceMode,
  onToggleDeviceMode,
  overlayColor,
}) => {
  if (!isDeviceMode) {
    return (
      <div className="w-full relative">
        {overlayColor && (
          <div
            className="fixed inset-0 pointer-events-none z-40 transition-colors"
            style={{ backgroundColor: overlayColor }}
          />
        )}
        {children}
      </div>
    );
  }

  // Current time for status bar
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-2">
      {/* Android Device Outer Chassis */}
      <div className="relative w-full max-w-[430px] rounded-[48px] bg-neutral-950 p-3 shadow-2xl border-[6px] border-neutral-800 ring-1 ring-neutral-700/50">
        {/* Device Earpiece / Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-full flex items-center justify-center z-50 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-700 mr-2" />
          <div className="w-10 h-1 rounded-full bg-neutral-800" />
        </div>

        {/* Screen Bezel */}
        <div className="relative w-full h-[840px] rounded-[40px] bg-white overflow-hidden flex flex-col">
          {/* Dyslexia Sensory Tint Overlay */}
          {overlayColor && (
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-colors"
              style={{ backgroundColor: overlayColor }}
            />
          )}

          {/* Android Status Bar */}
          <div className="h-10 px-6 flex items-center justify-between bg-neutral-100/90 border-b border-neutral-200/60 text-neutral-800 text-xs font-semibold shrink-0 select-none z-40">
            <span>{timeString}</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">5G</span>
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            {children}
          </div>

          {/* Android Gesture Navigation Bar Pill */}
          <div className="h-6 bg-white shrink-0 flex items-center justify-center z-40 border-t border-neutral-100">
            <div className="w-32 h-1 bg-neutral-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
