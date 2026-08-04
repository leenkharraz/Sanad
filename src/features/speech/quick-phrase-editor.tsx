"use client";

import { useState } from "react";
import { Plus, Star, Pencil, Trash2, Volume2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuickPhrases } from "@/components/providers/quick-phrases-provider";

export function QuickPhraseEditor({ onSpeak }: { onSpeak: (text: string) => void }) {
  const { phrases, addPhrase, updatePhrase, deletePhrase, toggleFavorite } = useQuickPhrases();
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!newText.trim()) return;
    addPhrase(newText);
    setNewText("");
  }

  function startEdit(id: string, text: string) {
    setEditingId(id);
    setEditingText(text);
  }

  function commitEdit() {
    if (editingId) updatePhrase(editingId, editingText);
    setEditingId(null);
  }

  const sorted = [...phrases].sort((a, b) => Number(b.favorite) - Number(a.favorite));

  return (
    <section aria-labelledby="quick-phrases-heading" className="space-y-3">
      <h2 id="quick-phrases-heading" className="text-sm font-semibold text-text-primary">
        Quick phrases
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newText}
          onChange={(event) => setNewText(event.target.value)}
          placeholder="Add a new phrase"
          aria-label="New quick phrase"
          className="h-11 flex-1 rounded-xl border border-border bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <Button type="submit" size="icon-lg" aria-label="Add phrase" disabled={!newText.trim()}>
          <Plus aria-hidden="true" className="size-4" />
        </Button>
      </form>

      <ul className="space-y-2">
        {sorted.map((phrase) => (
          <li
            key={phrase.id}
            className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-2"
          >
            {editingId === phrase.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  aria-label="Edit phrase"
                  autoFocus
                  className="h-9 flex-1 rounded-lg border border-border bg-background px-2.5 text-sm text-text-primary"
                />
                <button
                  type="button"
                  onClick={commitEdit}
                  aria-label="Save phrase"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-success hover:bg-success-soft"
                >
                  <Check aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  aria-label="Cancel edit"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-soft"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onSpeak(phrase.text)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1.5 py-1 text-left text-sm font-medium text-text-primary hover:bg-surface-soft"
                >
                  <Volume2 aria-hidden="true" className="size-4 shrink-0 text-brand-700" />
                  <span className="truncate">{phrase.text}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(phrase.id)}
                  aria-label={phrase.favorite ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={phrase.favorite}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-surface-soft",
                    phrase.favorite ? "text-gold" : "text-text-muted"
                  )}
                >
                  <Star aria-hidden="true" className="size-4" fill={phrase.favorite ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(phrase.id, phrase.text)}
                  aria-label="Edit phrase"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-soft hover:text-text-primary"
                >
                  <Pencil aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deletePhrase(phrase.id)}
                  aria-label="Delete phrase"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </>
            )}
          </li>
        ))}
        {sorted.length === 0 && (
          <p className="text-sm text-text-muted">No quick phrases yet. Add one above.</p>
        )}
      </ul>
    </section>
  );
}
