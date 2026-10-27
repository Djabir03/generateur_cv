"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Competence } from "@/app/lib/types";
import { uid } from "@/app/lib/types";
import { Section, inputCls } from "./form-ui";

interface Props {
  competences: Competence[];
  onChange: (liste: Competence[]) => void;
  onReset: () => void;
}

const nouvelleCompetence = (): Competence => ({
  id: uid(),
  nom: "",
  niveau: 50,
});

export default function FormCompetences({
  competences,
  onChange,
  onReset,
}: Props) {
  const ajouter = () => onChange([...competences, nouvelleCompetence()]);

  const modifier = (id: string, patch: Partial<Competence>) =>
    onChange(competences.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const supprimer = (id: string) =>
    onChange(competences.filter((c) => c.id !== id));

  return (
    <Section
      title="Compétences"
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
      {competences.length === 0 ? (
        <p className="rounded-lg border border-dashed border-base-300 py-4 text-center text-sm opacity-60">
          Aucune compétence. Cliquez sur « Ajouter » pour commencer.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {competences.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <input
                className={inputCls}
                value={c.nom}
                onChange={(e) => modifier(c.id, { nom: e.target.value })}
                placeholder="JavaScript"
              />
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                className="range range-secondary range-sm w-24 shrink-0"
                value={c.niveau}
                onChange={(e) =>
                  modifier(c.id, { niveau: Number(e.target.value) })
                }
                title={`Niveau : ${c.niveau}%`}
              />
              <span className="w-10 shrink-0 text-right text-xs opacity-70">
                {c.niveau}%
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-circle shrink-0"
                onClick={() => supprimer(c.id)}
                title="Supprimer cette compétence"
              >
                <Trash2 className="w-4 text-error" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
