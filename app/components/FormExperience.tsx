"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Experience } from "@/app/lib/types";
import { uid } from "@/app/lib/types";
import { Field, Section, inputCls, textareaCls } from "./form-ui";

interface Props {
  experiences: Experience[];
  onChange: (liste: Experience[]) => void;
  onReset: () => void;
}

const nouvelleExperience = (): Experience => ({
  id: uid(),
  poste: "",
  entreprise: "",
  ville: "",
  debut: "",
  fin: "",
  enCours: false,
  description: "",
});

export default function FormExperience({
  experiences,
  onChange,
  onReset,
}: Props) {
  const ajouter = () => onChange([...experiences, nouvelleExperience()]);

  const modifier = (id: string, patch: Partial<Experience>) =>
    onChange(experiences.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const supprimer = (id: string) =>
    onChange(experiences.filter((x) => x.id !== id));

  return (
    <Section
      title="Expériences"
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
      {experiences.length === 0 ? (
        <p className="rounded-lg border border-dashed border-base-300 py-4 text-center text-sm opacity-60">
          Aucune expérience. Cliquez sur « Ajouter » pour commencer.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.map((x, index) => (
            <div
              key={x.id}
              className="flex flex-col gap-3 rounded-lg border border-base-300 bg-base-200/50 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="badge badge-ghost badge-sm">
                  Expérience {index + 1}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => supprimer(x.id)}
                  title="Supprimer cette expérience"
                >
                  <Trash2 className="w-4 text-error" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Poste occupé" className="col-span-2">
                  <input
                    className={inputCls}
                    value={x.poste}
                    onChange={(e) => modifier(x.id, { poste: e.target.value })}
                    placeholder="Développeur front-end"
                  />
                </Field>
                <Field label="Entreprise">
                  <input
                    className={inputCls}
                    value={x.entreprise}
                    onChange={(e) =>
                      modifier(x.id, { entreprise: e.target.value })
                    }
                    placeholder="Acme SAS"
                  />
                </Field>
                <Field label="Ville">
                  <input
                    className={inputCls}
                    value={x.ville}
                    onChange={(e) => modifier(x.id, { ville: e.target.value })}
                    placeholder="Lyon"
                  />
                </Field>
                <Field label="Début">
                  <input
                    type="month"
                    className={inputCls}
                    value={x.debut}
                    onChange={(e) => modifier(x.id, { debut: e.target.value })}
                  />
                </Field>
                <Field label="Fin">
                  <div className="flex flex-col gap-2">
                    <input
                      type="month"
                      className={inputCls}
                      value={x.fin}
                      disabled={x.enCours}
                      onChange={(e) => modifier(x.id, { fin: e.target.value })}
                    />
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-secondary toggle-sm"
                        checked={x.enCours}
                        onChange={(e) =>
                          modifier(x.id, {
                            enCours: e.target.checked,
                            fin: e.target.checked ? "" : x.fin,
                          })
                        }
                      />
                      <span className="text-xs opacity-70">Poste en cours</span>
                    </label>
                  </div>
                </Field>
                <Field label="Missions / Réalisations" className="col-span-2">
                  <textarea
                    rows={3}
                    className={textareaCls}
                    value={x.description}
                    onChange={(e) =>
                      modifier(x.id, { description: e.target.value })
                    }
                    placeholder="• Réalisations concrètes, technologies utilisées, résultats obtenus..."
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
