export interface QuickPhrase {
  id: string;
  text: string;
  favorite: boolean;
}

export const DEFAULT_QUICK_PHRASES: QuickPhrase[] = [
  { id: "qp-thank-you", text: "Thank you", favorite: true },
  { id: "qp-need-help", text: "I need help", favorite: true },
  { id: "qp-restroom", text: "Where is the restroom?", favorite: true },
  { id: "qp-lost", text: "I am lost", favorite: true },
];
