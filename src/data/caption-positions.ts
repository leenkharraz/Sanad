import type { CaptionPosition } from "@/types/preferences";
import type { TranslationKey } from "@/i18n/use-translation";

/** Row-major 3x3 grid order, matching the visual layout of the position picker. */
export const CAPTION_POSITIONS: { value: CaptionPosition; labelKey: TranslationKey }[] = [
  { value: "top-left", labelKey: "settingsPages.captionDisplay.positions.topLeft" },
  { value: "top-center", labelKey: "settingsPages.captionDisplay.positions.topCenter" },
  { value: "top-right", labelKey: "settingsPages.captionDisplay.positions.topRight" },
  { value: "center-left", labelKey: "settingsPages.captionDisplay.positions.centerLeft" },
  { value: "center", labelKey: "settingsPages.captionDisplay.positions.center" },
  { value: "center-right", labelKey: "settingsPages.captionDisplay.positions.centerRight" },
  { value: "bottom-left", labelKey: "settingsPages.captionDisplay.positions.bottomLeft" },
  { value: "bottom-center", labelKey: "settingsPages.captionDisplay.positions.bottomCenter" },
  { value: "bottom-right", labelKey: "settingsPages.captionDisplay.positions.bottomRight" },
];

const JUSTIFY: Record<CaptionPosition, string> = {
  "top-left": "justify-start",
  "top-center": "justify-center",
  "top-right": "justify-end",
  "center-left": "justify-start",
  center: "justify-center",
  "center-right": "justify-end",
  "bottom-left": "justify-start",
  "bottom-center": "justify-center",
  "bottom-right": "justify-end",
};

const ALIGN: Record<CaptionPosition, string> = {
  "top-left": "items-start",
  "top-center": "items-start",
  "top-right": "items-start",
  "center-left": "items-center",
  center: "items-center",
  "center-right": "items-center",
  "bottom-left": "items-end",
  "bottom-center": "items-end",
  "bottom-right": "items-end",
};

export function captionPositionClasses(position: CaptionPosition): string {
  return `${JUSTIFY[position]} ${ALIGN[position]}`;
}
