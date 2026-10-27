"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { LIBELLES_SECTIONS, MODELES, PALETTE } from "@/app/lib/types";
import type { ModeleId, StyleCV } from "@/app/lib/types";
import { Section } from "./form-ui";

interface Props {
  style: StyleCV;
  onChange: (patch: Partial<StyleCV>) => void;
  onReset: () => void;
}

/** Miniature schématique d'un modèle. */
function ApercuModele({ id, couleur }: { id: ModeleId; couleur: string }) {
  if (id === "moderne") {
    return (
      <span className="flex h-10 w-full gap-0.5 rounded bg-base-300 p-0.5">
        <span
          className="w-1/3 rounded-[2px]"
          style={{ backgroundColor: couleur }}
        />
        <span className="flex-1 rounded-[2px] bg-base-100" />
      </span>
    );
  }
  if (id === "minimal") {
    return (
      <span className="flex h-10 w-full flex-col gap-0.5 rounded bg-base-300 p-0.5">
        <span className="flex flex-1 items-start gap-1">
          <span className="mt-1 h-1.5 w-1/2 rounded-[2px] bg-base-100" />
          <span className="ml-auto h-4 w-4 rounded-[2px] bg-base-100" />
        </span>
        <span
          className="h-1 w-full rounded-[2px]"
          style={{ backgroundColor: couleur }}
        />
        <span className="h-2.5 w-full rounded-[2px] bg-base-100" />
      </span>
    );
  }
  return (
    <span className="flex h-10 w-full flex-col gap-0.5 rounded bg-base-300 p-0.5">
      <span
        className="h-2.5 w-full rounded-[2px]"
        style={{ backgroundColor: couleur }}
      />
      <span className="flex flex-1 gap-0.5">
        <span className="flex-1 rounded-[2px] bg-base-100" />
        <span className="w-1/3 rounded-[2px] bg-base-100 opacity-70" />
      </span>
    </span>
  );
}

export default function FormStyle({ style, onChange, onReset }: Props) {
  const deplacer = (index: number, delta: number) => {
    const cible = index + delta;
    if (cible < 0 || cible >= style.ordre.length) return;
    const ordre = [...style.ordre];
    [ordre[index], ordre[cible]] = [ordre[cible], ordre[index]];
    onChange({ ordre });
  };

  return (
    <Section title="Modèle & couleurs" onReset={onReset}>
      {/* Modèles */}
      <div className="grid grid-cols-3 gap-2">
        {MODELES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={style.modele === m.id}
            onClick={() => onChange({ modele: m.id })}
            className={`flex flex-col gap-2 rounded-lg border-2 p-2 text-center transition ${
              style.modele === m.id
                ? "border-secondary bg-secondary/10"
                : "border-base-300 hover:border-secondary/60"
            }`}
          >
            <ApercuModele id={m.id} couleur={style.couleur} />
            <span className="text-xs font-bold">{m.nom}</span>
            <span className="text-[10px] leading-tight opacity-70">
              {m.description}
            </span>
          </button>
        ))}
      </div>

      {/* Couleurs */}
      <div className="flex flex-wrap items-center gap-2">
        {PALETTE.map((c) => {
          const actif = style.couleur === c.couleur;
          return (
            <button
              key={c.id}
              type="button"
              title={c.nom}
              aria-label={`Couleur ${c.nom}`}
              aria-pressed={actif}
              onClick={() =>
                onChange({ couleur: c.couleur, couleurTexte: c.texte })
              }
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                actif ? "scale-110 border-secondary" : "border-base-300"
              }`}
              style={{ backgroundColor: c.couleur }}
            >
              {actif && (
                <Check className="h-4 w-4" style={{ color: c.texte }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Ordre des sections */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium opacity-70">
          Ordre des sections
        </span>
        {style.ordre.map((id, i) => (
          <div
            key={id}
            className="flex items-center justify-between gap-2 rounded border border-base-300 bg-base-200/60 px-2 py-1"
          >
            <span className="truncate text-xs font-medium">
              {i + 1}. {LIBELLES_SECTIONS[id]}
            </span>
            <div className="flex shrink-0 gap-0.5">
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-circle"
                disabled={i === 0}
                onClick={() => deplacer(i, -1)}
                title="Monter"
              >
                <ChevronUp className="w-4" />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-circle"
                disabled={i === style.ordre.length - 1}
                onClick={() => deplacer(i, 1)}
                title="Descendre"
              >
                <ChevronDown className="w-4" />
              </button>
            </div>
          </div>
        ))}
        <p className="text-[10px] leading-snug opacity-60">
          Dans les modèles Classique et Moderne, les 3 premières sections
          forment la colonne principale et les 3 suivantes la colonne latérale.
          Le modèle Minimal les affiche toutes, dans cet ordre, sur une seule
          colonne.
        </p>
      </div>
    </Section>
  );
}
