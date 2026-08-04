import { Button } from "@/components/ui/button";

const PROVIDERS = ["Google", "Apple", "Nafath"] as const;

export function ProviderButtons() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {PROVIDERS.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            size="touch"
            disabled
            aria-disabled="true"
            title={`${provider} sign-in is a prototype placeholder and is not connected yet.`}
            className="flex-col gap-0.5 px-1 text-xs"
          >
            {provider}
          </Button>
        ))}
      </div>
      <p className="text-center text-xs text-text-muted">
        Prototype integrations — not connected yet
      </p>
    </div>
  );
}
