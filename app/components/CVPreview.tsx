import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { couleurTexteSurBlanc, formatPeriode } from "@/app/lib/types";
import type { CVData, SectionId } from "@/app/lib/types";

interface Props {
  cv: CVData;
}

type Ton = "clair" | "inverse";

interface BlocProps {
  cv: CVData;
  /** "clair" = texte sombre sur fond neutre, "inverse" = texte clair sur fond coloré. */
  ton: Ton;
  /** Variante de la couleur garantie lisible sur fond clair. */
  accent: string;
}

/* ————————————————— Briques ————————————————— */

function BlocTitre({
  children,
  ton,
  accent,
}: {
  children: ReactNode;
  ton: Ton;
  accent: string;
}) {
  const inverse = ton === "inverse";
  return (
    <h2
      className={`mb-3 border-b pb-1 text-xs font-bold uppercase tracking-[0.15em] ${
        inverse ? "border-secondary-content/40" : "border-base-300"
      }`}
      style={inverse ? undefined : { color: accent }}
    >
      {children}
    </h2>
  );
}

function Photo({
  photo,
  initiales,
  className = "",
}: {
  photo: string;
  initiales: string;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-base-100 text-secondary ${className}`}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="font-bold">{initiales}</span>
      )}
    </div>
  );
}

function BlocContacts({ cv, className = "" }: { cv: CVData; className?: string }) {
  const p = cv.personnel;
  const items = [
    { Icone: Mail, texte: p.email },
    { Icone: Phone, texte: p.telephone },
    { Icone: MapPin, texte: p.adresse },
    { Icone: Globe, texte: p.site },
  ].filter((c) => c.texte.trim());

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-x-5 gap-y-1 text-xs ${className}`}>
      {items.map(({ Icone, texte }, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <Icone className="h-3.5 w-3.5 shrink-0" />
          {texte}
        </span>
      ))}
    </div>
  );
}

function BlocAPropos({ cv, ton, accent }: BlocProps) {
  const texte = cv.personnel.aPropos.trim();
  if (!texte) return null;
  return (
    <section>
      <BlocTitre ton={ton} accent={accent}>
        À propos
      </BlocTitre>
      <p
        className={`whitespace-pre-line text-sm leading-relaxed ${
          ton === "inverse" ? "opacity-90" : "opacity-80"
        }`}
      >
        {cv.personnel.aPropos}
      </p>
    </section>
  );
}

function BlocExperiences({ cv, ton, accent }: BlocProps) {
  if (cv.experiences.length === 0) return null;
  const inverse = ton === "inverse";
  return (
    <section>
      <BlocTitre ton={ton} accent={accent}>
        Expériences professionnelles
      </BlocTitre>
      {cv.experiences.map((x) => {
        const periode = formatPeriode(x.debut, x.fin, x.enCours);
        const lieu = [x.entreprise, x.ville].filter(Boolean).join(" • ");
        return (
          <div key={x.id} className="mb-4 last:mb-0">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{x.poste || "Poste occupé"}</h3>
              {periode && (
                <span
                  className="shrink-0 text-xs font-semibold"
                  style={inverse ? undefined : { color: accent }}
                >
                  {periode}
                </span>
              )}
            </div>
            {lieu && <p className="text-sm font-medium opacity-70">{lieu}</p>}
            {x.description && (
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed opacity-80">
                {x.description}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

function BlocFormations({ cv, ton, accent }: BlocProps) {
  if (cv.formations.length === 0) return null;
  const inverse = ton === "inverse";
  return (
    <section>
      <BlocTitre ton={ton} accent={accent}>
        Formations
      </BlocTitre>
      {cv.formations.map((f) => {
        const periode = formatPeriode(f.debut, f.fin);
        const lieu = [f.etablissement, f.ville].filter(Boolean).join(" • ");
        return (
          <div key={f.id} className="mb-4 last:mb-0">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{f.diplome || "Diplôme"}</h3>
              {periode && (
                <span
                  className="shrink-0 text-xs font-semibold"
                  style={inverse ? undefined : { color: accent }}
                >
                  {periode}
                </span>
              )}
            </div>
            {lieu && <p className="text-sm font-medium opacity-70">{lieu}</p>}
            {f.description && (
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed opacity-80">
                {f.description}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

function BlocCompetences({ cv, ton, accent }: BlocProps) {
  if (cv.competences.length === 0) return null;
  const inverse = ton === "inverse";
  return (
    <section>
      <BlocTitre ton={ton} accent={accent}>
        Compétences
      </BlocTitre>
      <div className="flex flex-col gap-3">
        {cv.competences.map((c) => (
          <div key={c.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{c.nom || "Compétence"}</span>
              <span className="text-xs opacity-60">{c.niveau}%</span>
            </div>
            <div
              className={`h-1.5 overflow-hidden rounded-full ${
                inverse ? "bg-secondary-content/30" : "bg-base-300"
              }`}
            >
              <div
                className={`h-full rounded-full ${
                  inverse ? "bg-secondary-content" : "bg-secondary"
                }`}
                style={{ width: `${c.niveau}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlocLangues({ cv, ton, accent }: BlocProps) {
  if (cv.langues.length === 0) return null;
  return (
    <section>
      <BlocTitre ton={ton} accent={accent}>
        Langues
      </BlocTitre>
      <div className="flex flex-col gap-2">
        {cv.langues.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="font-medium">{l.nom || "Langue"}</span>
            <span className="text-xs opacity-70">{l.niveau}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlocInterets({ cv, ton, accent }: BlocProps) {
  if (cv.interets.length === 0) return null;
  const inverse = ton === "inverse";
  return (
    <section>
      <BlocTitre ton={ton} accent={accent}>
        Centres d&apos;intérêt
      </BlocTitre>
      <div className="flex flex-wrap gap-2">
        {cv.interets.map((i) => (
          <span
            key={i.id}
            className="badge"
            style={
              inverse
                ? {
                    border: "1px solid currentColor",
                    background: "rgba(255,255,255,0.15)",
                  }
                : { color: accent, border: `1px solid ${accent}` }
            }
          >
            {i.nom}
          </span>
        ))}
      </div>
    </section>
  );
}

const BLOCS: Record<SectionId, (props: BlocProps) => ReactElement | null> = {
  apropos: BlocAPropos,
  experiences: BlocExperiences,
  formations: BlocFormations,
  competences: BlocCompetences,
  langues: BlocLangues,
  interets: BlocInterets,
};

/* ————————————————— Aperçu ————————————————— */

export default function CVPreview({ cv }: Props) {
  const style = cv.style;
  const p = cv.personnel;
  const nom = `${p.prenom} ${p.nom}`.trim();
  const initiales =
    `${p.prenom.trim()[0] ?? ""}${p.nom.trim()[0] ?? ""}`.toUpperCase() || "?";

  const couleur = style.couleur || "#fd6f9c";
  const couleurFg = style.couleurTexte || "#160409";
  const accent = couleurTexteSurBlanc(couleur);

  // Les 3 premières sections → colonne principale, les 3 suivantes → latérale.
  const principal = style.ordre.slice(0, 3);
  const laterale = style.ordre.slice(3);

  const estVide = (id: SectionId) =>
    id === "apropos"
      ? !p.aPropos.trim()
      : id === "experiences"
        ? cv.experiences.length === 0
        : id === "formations"
          ? cv.formations.length === 0
          : id === "competences"
            ? cv.competences.length === 0
            : id === "langues"
              ? cv.langues.length === 0
              : cv.interets.length === 0;

  const toutVide = style.ordre.every(estVide);
  const lateraleVide = laterale.every(estVide);

  // Surcharge les couleurs DaisyUI du bloc de l'aperçu.
  const vars = {
    "--color-secondary": couleur,
    "--color-secondary-content": couleurFg,
  } as unknown as CSSProperties;

  const blocs = (groupe: SectionId[], ton: Ton) =>
    groupe.map((id) => {
      const Bloc = BLOCS[id];
      return <Bloc key={id} cv={cv} ton={ton} accent={accent} />;
    });

  const carte =
    "flex min-h-[1123px] w-full max-w-[794px] overflow-hidden rounded-sm bg-base-100 text-base-content shadow-2xl";

  const indiceVide = (
    <p className="italic opacity-50">
      Renseignez votre profil dans le formulaire à gauche : votre CV
      s&apos;écrit ici en direct.
    </p>
  );

  if (style.modele === "moderne") {
    return (
      <div id="cv-preview" style={vars} className={`${carte} flex-row`}>
        <aside className="flex w-[300px] shrink-0 flex-col gap-6 bg-secondary p-8 text-secondary-content">
          <Photo
            photo={p.photo}
            initiales={initiales}
            className="h-32 w-32 self-center rounded-full border-4 border-secondary-content/40 text-4xl"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold leading-tight">
              {nom || "Votre prénom et nom"}
            </h1>
            <p className="mt-1 text-sm opacity-90">
              {p.titre || "Votre titre professionnel"}
            </p>
          </div>
          <BlocContacts cv={cv} className="flex-col gap-2 opacity-90" />
          {!lateraleVide && (
            <div className="border-t border-secondary-content/40 pt-5">
              <div className="flex flex-col gap-6">
                {blocs(laterale, "inverse")}
              </div>
            </div>
          )}
        </aside>
        <main className="flex flex-1 flex-col p-8">
          <div className="flex flex-col gap-6">{blocs(principal, "clair")}</div>
          {toutVide && indiceVide}
        </main>
      </div>
    );
  }

  if (style.modele === "minimal") {
    return (
      <div id="cv-preview" style={vars} className={`${carte} flex-col`}>
        <header className="flex items-start justify-between gap-6 px-10 pb-6 pt-10">
          <div className="min-w-0">
            <h1 className="text-4xl font-bold leading-none">
              {nom || "Votre prénom et nom"}
            </h1>
            <p
              className="mt-2 text-lg font-medium"
              style={{ color: accent }}
            >
              {p.titre || "Votre titre professionnel"}
            </p>
            <BlocContacts cv={cv} className="mt-4 opacity-70" />
          </div>
          <Photo
            photo={p.photo}
            initiales={initiales}
            className="h-24 w-24 rounded-lg text-2xl ring-1 ring-base-300"
          />
        </header>
        <div className="h-1.5 w-full bg-secondary" />
        <main className="flex flex-1 flex-col px-10 py-8">
          <div className="flex flex-col gap-6">{blocs(style.ordre, "clair")}</div>
          {toutVide && indiceVide}
        </main>
      </div>
    );
  }

  // Modèle classique
  return (
    <div id="cv-preview" style={vars} className={`${carte} flex-col`}>
      <header className="flex items-center gap-6 bg-secondary px-10 py-8 text-secondary-content">
        <Photo
          photo={p.photo}
          initiales={initiales}
          className="h-24 w-24 rounded-full border-4 border-secondary-content/40 text-3xl"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight">
            {nom || "Votre prénom et nom"}
          </h1>
          <p className="text-lg opacity-90">
            {p.titre || "Votre titre professionnel"}
          </p>
          <BlocContacts cv={cv} className="mt-3 opacity-90" />
        </div>
      </header>
      <div className="flex flex-1 items-stretch">
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-6">{blocs(principal, "clair")}</div>
          {toutVide && indiceVide}
        </main>
        {!lateraleVide && (
          <aside className="w-[260px] shrink-0 bg-base-200 p-8">
            <div className="flex flex-col gap-6">
              {blocs(laterale, "clair")}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
