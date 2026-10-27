"use client";

import { ImagePlus, X } from "lucide-react";
import type { ChangeEvent } from "react";
import type { PersonalInfo } from "@/app/lib/types";
import { Field, Section, inputCls, textareaCls } from "./form-ui";

interface Props {
  info: PersonalInfo;
  onChange: (patch: Partial<PersonalInfo>) => void;
  onReset: () => void;
}

export default function FormDetailPersonnel({
  info,
  onChange,
  onReset,
}: Props) {
  const initiales =
    `${info.prenom.trim()[0] ?? ""}${info.nom.trim()[0] ?? ""}`.toUpperCase() ||
    "?";

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ photo: String(reader.result) });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <Section title="Présentez-vous" onReset={onReset}>
      {/* Photo de profil */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-secondary bg-base-200 text-secondary">
          {info.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.photo}
              alt="Photo de profil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold">{initiales}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="btn btn-secondary btn-xs cursor-pointer">
            <ImagePlus className="w-3.5" />
            Choisir une photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </label>
          {info.photo && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => onChange({ photo: "" })}
            >
              <X className="w-3.5" />
              Retirer (initiales)
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom">
          <input
            className={inputCls}
            value={info.prenom}
            onChange={(e) => onChange({ prenom: e.target.value })}
            placeholder="Marie"
          />
        </Field>
        <Field label="Nom">
          <input
            className={inputCls}
            value={info.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Dupont"
          />
        </Field>
        <Field label="Titre professionnel" className="col-span-2">
          <input
            className={inputCls}
            value={info.titre}
            onChange={(e) => onChange({ titre: e.target.value })}
            placeholder="Développeuse web full-stack"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className={inputCls}
            value={info.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="marie.dupont@email.com"
          />
        </Field>
        <Field label="Téléphone">
          <input
            type="tel"
            className={inputCls}
            value={info.telephone}
            onChange={(e) => onChange({ telephone: e.target.value })}
            placeholder="06 12 34 56 78"
          />
        </Field>
        <Field label="Adresse / Ville" className="col-span-2">
          <input
            className={inputCls}
            value={info.adresse}
            onChange={(e) => onChange({ adresse: e.target.value })}
            placeholder="Paris, France"
          />
        </Field>
        <Field label="Site web / LinkedIn" className="col-span-2">
          <input
            className={inputCls}
            value={info.site}
            onChange={(e) => onChange({ site: e.target.value })}
            placeholder="linkedin.com/in/marie-dupont"
          />
        </Field>
        <Field label="À propos de moi" className="col-span-2">
          <textarea
            rows={4}
            className={textareaCls}
            value={info.aPropos}
            onChange={(e) => onChange({ aPropos: e.target.value })}
            placeholder="Quelques lignes pour vous présenter : parcours, objectifs, points forts..."
          />
        </Field>
      </div>
    </Section>
  );
}
