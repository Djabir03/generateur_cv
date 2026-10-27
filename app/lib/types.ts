export interface PersonalInfo {
  photo: string;
  prenom: string;
  nom: string;
  titre: string;
  email: string;
  telephone: string;
  adresse: string;
  site: string;
  aPropos: string;
}

export interface Experience {
  id: string;
  poste: string;
  entreprise: string;
  ville: string;
  debut: string;
  fin: string;
  enCours: boolean;
  description: string;
}

export interface Formation {
  id: string;
  diplome: string;
  etablissement: string;
  ville: string;
  debut: string;
  fin: string;
  description: string;
}

export interface Competence {
  id: string;
  nom: string;
  niveau: number; // pourcentage (0 - 100)
}

export interface Langue {
  id: string;
  nom: string;
  niveau: string;
}

export interface Interet {
  id: string;
  nom: string;
}

export type ModeleId = "classique" | "moderne" | "minimal";

export type SectionId =
  | "apropos"
  | "experiences"
  | "formations"
  | "competences"
  | "langues"
  | "interets";

/** Apparence du CV : modèle, couleurs et ordre des sections. */
export interface StyleCV {
  modele: ModeleId;
  couleur: string; // fond des bandeaux / accents
  couleurTexte: string; // texte lisible sur ce fond
  ordre: SectionId[];
}

export interface Couleur {
  id: string;
  nom: string;
  couleur: string;
  texte: string;
}

export const PALETTE: Couleur[] = [
  { id: "sunset", nom: "Sunset (thème)", couleur: "#fd6f9c", texte: "#160409" },
  { id: "framboise", nom: "Framboise", couleur: "#e11d48", texte: "#ffffff" },
  { id: "marine", nom: "Marine", couleur: "#1e3a5f", texte: "#ffffff" },
  { id: "bleu", nom: "Bleu", couleur: "#2563eb", texte: "#ffffff" },
  { id: "vert", nom: "Vert", couleur: "#15803d", texte: "#ffffff" },
  { id: "ambre", nom: "Ambre", couleur: "#b45309", texte: "#ffffff" },
  { id: "violet", nom: "Violet", couleur: "#7c3aed", texte: "#ffffff" },
  { id: "encre", nom: "Encre", couleur: "#111827", texte: "#ffffff" },
];

export const MODELES: {
  id: ModeleId;
  nom: string;
  description: string;
}[] = [
  {
    id: "classique",
    nom: "Classique",
    description: "Bandeau en tête, deux colonnes",
  },
  {
    id: "moderne",
    nom: "Moderne",
    description: "Colonne latérale colorée",
  },
  {
    id: "minimal",
    nom: "Minimal",
    description: "Une seule colonne, épuré",
  },
];

export const ORDRE_DEFAUT: SectionId[] = [
  "apropos",
  "experiences",
  "formations",
  "competences",
  "langues",
  "interets",
];

export const LIBELLES_SECTIONS: Record<SectionId, string> = {
  apropos: "À propos",
  experiences: "Expériences",
  formations: "Formations",
  competences: "Compétences",
  langues: "Langues",
  interets: "Centres d'intérêt",
};

export interface CVData {
  personnel: PersonalInfo;
  experiences: Experience[];
  formations: Formation[];
  competences: Competence[];
  langues: Langue[];
  interets: Interet[];
  style: StyleCV;
}

export const NIVEAUX_LANGUE = [
  "Débutant",
  "Intermédiaire",
  "Avancé",
  "Courant",
  "Natif / Bilingue",
];

export const uid = () => Math.random().toString(36).slice(2, 10);

export function createEmptyCV(): CVData {
  return {
    personnel: {
      photo: "/profile.jpg",
      prenom: "",
      nom: "",
      titre: "",
      email: "",
      telephone: "",
      adresse: "",
      site: "",
      aPropos: "",
    },
    experiences: [],
    formations: [],
    competences: [],
    langues: [],
    interets: [],
    style: {
      modele: "classique",
      couleur: PALETTE[0].couleur,
      couleurTexte: PALETTE[0].texte,
      ordre: [...ORDRE_DEFAUT],
    },
  };
}

function luminance([r, g, b]: [number, number, number]): number {
  const canal = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function hexEnRgb(hex: string): [number, number, number] {
  const brut = hex.replace("#", "");
  const v =
    brut.length === 3
      ? brut
          .split("")
          .map((c) => c + c)
          .join("")
      : brut;
  if (v.length !== 6) return [0, 0, 0];
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Version d'une couleur garantie lisible en texte sur fond blanc
 * (assombrit jusqu'à un contraste WCAG d'au moins 4.5:1).
 */
export function couleurTexteSurBlanc(hex: string): string {
  let [r, g, b] = hexEnRgb(hex);
  let l = luminance([r, g, b]);
  let garde = 0;
  while (1.05 / (l + 0.05) < 4.5 && garde < 40) {
    r = Math.round(r * 0.92);
    g = Math.round(g * 0.92);
    b = Math.round(b * 0.92);
    l = luminance([r, g, b]);
    garde += 1;
  }
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Transforme "2024-05" en "05/2024". */
export function formatMois(valeur: string): string {
  if (!valeur) return "";
  const [annee, mois] = valeur.split("-");
  if (!annee || !mois) return valeur;
  return `${mois}/${annee}`;
}

/** Période du type "05/2021 – Aujourd'hui". */
export function formatPeriode(
  debut: string,
  fin: string,
  enCours = false,
): string {
  const debutFormate = formatMois(debut);
  const finFormate = enCours ? "Aujourd'hui" : formatMois(fin);
  if (debutFormate && finFormate) return `${debutFormate} – ${finFormate}`;
  return debutFormate || finFormate;
}
