"use client";

import { useState } from "react";
import { Phone, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/use-translation";
import type { EmergencyContact } from "@/types/emergency";

interface Props {
  contacts: EmergencyContact[];
  onAdd: (name: string, relationship: string, phone: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<EmergencyContact, "id">>) => void;
  onDelete: (id: string) => void;
}

const EMPTY_FORM = { name: "", relationship: "", phone: "" };

export function EmergencyContactsList({ contacts, onAdd, onUpdate, onDelete }: Props) {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function startAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setAdding(true);
  }

  function startEdit(contact: EmergencyContact) {
    setForm({ name: contact.name, relationship: contact.relationship, phone: contact.phone });
    setEditingId(contact.id);
    setAdding(false);
  }

  function cancel() {
    setAdding(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form.name.trim(), form.relationship.trim() || t("emergency.relationshipFallback"), form.phone.trim());
    }
    cancel();
  }

  const showForm = adding || editingId !== null;

  return (
    <section aria-labelledby="contacts-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="contacts-heading" className="text-sm font-semibold text-text-primary">
          {t("emergency.contactsTitle")}
        </h2>
        {!showForm && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
          >
            <Plus aria-hidden="true" className="size-3.5" /> {t("emergency.addContact")}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-2 rounded-xl border border-border bg-surface p-3">
          <input
            value={form.name}
            onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
            placeholder={t("emergency.namePlaceholder")}
            aria-label={t("emergency.nameAria")}
            dir="auto"
            required
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text-primary"
          />
          <input
            value={form.relationship}
            onChange={(event) => setForm((f) => ({ ...f, relationship: event.target.value }))}
            placeholder={t("emergency.relationshipPlaceholder")}
            aria-label={t("emergency.relationshipAria")}
            dir="auto"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text-primary"
          />
          <input
            value={form.phone}
            onChange={(event) => setForm((f) => ({ ...f, phone: event.target.value }))}
            placeholder={t("emergency.phonePlaceholder")}
            aria-label={t("emergency.phoneAria")}
            type="tel"
            dir="ltr"
            required
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-start text-sm text-text-primary"
          />
          <div className="flex gap-2 pt-1">
            <Button type="submit" size="sm" className="flex-1">
              {editingId ? t("common.save") : t("common.add")}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={cancel} className="flex-1">
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">{contact.name}</p>
              <p className="truncate text-xs text-text-secondary">
                {contact.relationship} · <bdi dir="ltr">{contact.phone}</bdi>
              </p>
            </div>
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              aria-label={t("emergency.callAria", { name: contact.name })}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-success hover:bg-success-soft"
            >
              <Phone aria-hidden="true" className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => startEdit(contact)}
              aria-label={t("emergency.editAria", { name: contact.name })}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-soft hover:text-text-primary"
            >
              <Pencil aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(contact.id)}
              aria-label={t("emergency.deleteAria", { name: contact.name })}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </li>
        ))}
        {contacts.length === 0 && (
          <p className="text-sm text-text-muted">{t("emergency.noContactsYet")}</p>
        )}
      </ul>
    </section>
  );
}
