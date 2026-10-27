"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Formation } from "@/app/lib/types";
import { uid } from "@/app/lib/types";
import { Field, Section, inputCls, textareaCls } from "./form-ui";

interface Props {
  formations: Formation[];
  onChange: (liste: Formation[]) => void;
  onReset: () => void;
}

const nouvelleFormation = (): Formation => ({
  id: uid(),
  diplome: "",
  etablissement: "",
  ville: "",
  debut: "",
  fin: "",
  description: "",
});

export default function FormFormation({
  formations,
  onChange,
  onReset,
}: Props) {
  const ajouter = () => onChange([...formations, nouvelleFormation()]);

  const modifier = (id: string, patch: Partial<Formation>) =>
    onChange(formations.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const supprimer = (id: string) =>
    onChange(formations.filter((f) => f.id !== id));

  return (
    <Section
      title="Formations"
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
      {formations.length === 0 ? (
        <p className="rounded-lg border border-dashed border-base-300 py-4 text-center text-sm opacity-60">
          Aucune formation. Cliquez sur « Ajouter » pour commencer.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {formations.map((f, index) => (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-lg border border-base-300 bg-base-200/50 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="badge badge-ghost badge-sm">
                  Formation {index + 1}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => supprimer(f.id)}
                  title="Supprimer cette formation"
                >
                  <Trash2 className="w-4 text-error" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Diplôme / Certification" className="col-span-2">
                  <input
                    className={inputCls}
                    value={f.diplome}
                    onChange={(e) => modifier(f.id, { diplome: e.target.value })}
                    placeholder="Master Informatique"
                  />
                </Field>
                <Field label="Établissement">
                  <input
                    className={inputCls}
                    value={f.etablissement}
                    onChange={(e) =>
                      modifier(f.id, { etablissement: e.target.value })
                    }
                    placeholder="Université de Lyon"
                  />
                </Field>
                <Field label="Ville">
                  <input
                    className={inputCls}
                    value={f.ville}
                    onChange={(e) => modifier(f.id, { ville: e.target.value })}
                    placeholder="Lyon"
                  />
                </Field>
                <Field label="Début">
                  <input
                    type="month"
                    className={inputCls}
                    value={f.debut}
                    onChange={(e) => modifier(f.id, { debut: e.target.value })}
                  />
                </Field>
                <Field label="Fin">
                  <input
                    type="month"
                    className={inputCls}
                    value={f.fin}
                    onChange={(e) => modifier(f.id, { fin: e.target.value })}
                  />
                </Field>
                <Field label="Détails (optionnel)" className="col-span-2">
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={f.description}
                    onChange={(e) =>
                      modifier(f.id, { description: e.target.value })
                    }
                    placeholder="Mémoire, spécialisation, mention..."
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
