"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Langue } from "@/app/lib/types";
import { NIVEAUX_LANGUE, uid } from "@/app/lib/types";
import { Field, Section, inputCls, selectCls } from "./form-ui";

interface Props {
  langues: Langue[];
  onChange: (liste: Langue[]) => void;
  onReset: () => void;
}

const nouvelleLangue = (): Langue => ({
  id: uid(),
  nom: "",
  niveau: NIVEAUX_LANGUE[1],
});

export default function FormLangues({ langues, onChange, onReset }: Props) {
  const ajouter = () => onChange([...langues, nouvelleLangue()]);

  const modifier = (id: string, patch: Partial<Langue>) =>
    onChange(langues.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const supprimer = (id: string) =>
    onChange(langues.filter((l) => l.id !== id));

  return (
    <Section
      title="Langues"
      onReset={onReset}
      action={
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={ajouter}
        >
          <Plus className="w-4" />
          Ajouter
        </button>
      }
    >
      {langues.length === 0 ? (
        <p className="rounded-lg border border-dashed border-base-300 py-4 text-center text-sm opacity-60">
          Aucune langue. Cliquez sur « Ajouter » pour commencer.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {langues.map((l, index) => (
            <div
              key={l.id}
              className="rounded-lg border border-base-300 bg-base-200/50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="badge badge-ghost badge-sm">
                  Langue {index + 1}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => supprimer(l.id)}
                  title="Supprimer cette langue"
                >
                  <Trash2 className="w-4 text-error" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Langue">
                  <input
                    className={inputCls}
                    value={l.nom}
                    onChange={(e) => modifier(l.id, { nom: e.target.value })}
                    placeholder="Anglais"
                  />
                </Field>
                <Field label="Niveau">
                  <select
                    className={selectCls}
                    value={l.niveau}
                    onChange={(e) => modifier(l.id, { niveau: e.target.value })}
                  >
                    {NIVEAUX_LANGUE.map((niveau) => (
                      <option key={niveau} value={niveau}>
                        {niveau}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
