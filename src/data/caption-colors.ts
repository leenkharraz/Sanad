import type { CaptionColor } from "@/types/preferences";
import type { TranslationKey } from "@/i18n/use-translation";

export const CAPTION_COLORS: { value: CaptionColor; hex: string; nameKey: TranslationKey }[] = [
  { value: "black", hex: "#000000", nameKey: "settingsPages.captionDisplay.colorNames.black" },
  { value: "white", hex: "#FFFFFF", nameKey: "settingsPages.captionDisplay.colorNames.white" },
  { value: "yellow", hex: "#FFD60A", nameKey: "settingsPages.captionDisplay.colorNames.yellow" },
  { value: "red", hex: "#FF3B30", nameKey: "settingsPages.captionDisplay.colorNames.red" },
  { value: "blue", hex: "#0A84FF", nameKey: "settingsPages.captionDisplay.colorNames.blue" },
  { value: "green", hex: "#34C759", nameKey: "settingsPages.captionDisplay.colorNames.green" },
];

export function captionColorHex(color: CaptionColor): string {
  return CAPTION_COLORS.find((c) => c.value === color)?.hex ?? "#000000";
}

export function hexToRgba(hex: string, opacityPercent: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(100, Math.max(0, opacityPercent)) / 100})`;
}
