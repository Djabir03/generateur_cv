"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { Interet } from "@/app/lib/types";
import { uid } from "@/app/lib/types";
import { Section, inputCls } from "./form-ui";

interface Props {
  interets: Interet[];
  onChange: (liste: Interet[]) => void;
  onReset: () => void;
}

export default function FormInterets({ interets, onChange, onReset }: Props) {
  const [saisie, setSaisie] = useState("");

  const ajouter = () => {
    const valeur = saisie.trim();
    if (!valeur) return;
    onChange([...interets, { id: uid(), nom: valeur }]);
    setSaisie("");
  };

  const supprimer = (id: string) =>
    onChange(interets.filter((i) => i.id !== id));

  return (
    <Section title="Centres d'intérêt" onReset={onReset}>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ajouter();
            }
          }}
          placeholder="Course à pied, Lecture..."
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm shrink-0"
          onClick={ajouter}
        >
          <Plus className="w-4" />
          Ajouter
        </button>
      </div>

      {interets.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {interets.map((i) => (
            <span
              key={i.id}
              className="badge badge-secondary badge-outline gap-1 py-4"
            >
              {i.nom}
              <button
                type="button"
                onClick={() => supprimer(i.id)}
                title={`Retirer « ${i.nom} »`}
              >
                <X className="w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-60">
          Saisissez un intérêt puis cliquez sur « Ajouter » (ou Entrée).
        </p>
      )}
    </Section>
  );
}
