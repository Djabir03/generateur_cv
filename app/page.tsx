"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CVPreview from "@/app/components/CVPreview";
import CV3DViewer from "@/app/components/CV3DViewer";
import FormCompetences from "@/app/components/FormCompetences";
import FormDetailPersonnel from "@/app/components/FormDetailPersonnel";
import FormExperience from "@/app/components/FormExperience";
import FormFormation from "@/app/components/FormFormation";
import FormInterets from "@/app/components/FormInterets";
import FormLangues from "@/app/components/FormLangues";
import FormStyle from "@/app/components/FormStyle";
import { createEmptyCV } from "@/app/lib/types";
import type { CVData, StyleCV } from "@/app/lib/types";

export default function Home() {
  const [cv, setCv] = useState<CVData>(createEmptyCV);
  const [exporting, setExporting] = useState(false);
  const [vue3D, setVue3D] = useState(false);

  /** Met à jour une clé du CV. */
  const maj = <K extends keyof CVData>(cle: K, valeur: CVData[K]) =>
    setCv((c) => ({ ...c, [cle]: valeur }));

  const majPersonnel = (patch: Partial<CVData["personnel"]>) =>
    setCv((c) => ({ ...c, personnel: { ...c.personnel, ...patch } }));

  const reinitialiserPersonnel = () =>
    setCv((c) => ({ ...c, personnel: createEmptyCV().personnel }));

  const majStyle = (patch: Partial<StyleCV>) =>
    setCv((c) => ({ ...c, style: { ...c.style, ...patch } }));

  const reinitialiserStyle = () =>
    setCv((c) => ({ ...c, style: createEmptyCV().style }));

  const genererPdf = async () => {
    const element = document.getElementById("cv-preview");
    if (!element) return;

    setExporting(true);
    // Pendant la capture, on déborde le conteneur pour ne rien couper.
    const conteneur = document.querySelector<HTMLElement>(".preview-zone");
    const overflowAvant = conteneur ? conteneur.style.overflowY : "";

    try {
      if (conteneur) {
        conteneur.style.overflowY = "visible";
        conteneur.scrollTop = 0;
      }

      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const largeurPage = pdf.internal.pageSize.getWidth();
      const hauteurPage = pdf.internal.pageSize.getHeight();
      const hauteurImage = (canvas.height * largeurPage) / canvas.width;

      // Découpe en pages A4 si le CV dépasse une page.
      let position = 0;
      let reste = hauteurImage;
      pdf.addImage(imageData, "JPEG", 0, position, largeurPage, hauteurImage);
      reste -= hauteurPage;
      while (reste > 0) {
        position -= hauteurPage;
        pdf.addPage();
        pdf.addImage(imageData, "JPEG", 0, position, largeurPage, hauteurImage);
        reste -= hauteurPage;
      }

      const identite = `${cv.personnel.prenom} ${cv.personnel.nom}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .trim();

      pdf.save(identite ? `${identite}-CV.pdf` : "Mon-CV.pdf");
    } catch (erreur) {
      console.error("Erreur lors de la génération du PDF :", erreur);
      alert("Impossible de générer le PDF. Veuillez réessayer.");
    } finally {
      if (conteneur) conteneur.style.overflowY = overflowAvant;
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Ordinateur */}
      <div className="hidden lg:block">
        <section className="flex h-screen items-center">
          {/* Panneau formulaire */}
          <div className="scrollable no-scrollbar h-full w-1/3 bg-base-200 p-10">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold italic">
                CV
                <span className="text-secondary">Générateur</span>
              </h1>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={genererPdf}
                disabled={exporting}
              >
                {exporting ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Download className="w-4" />
                )}
                {exporting ? "Génération..." : "Générer en PDF"}
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <FormStyle
                style={cv.style}
                onChange={majStyle}
                onReset={reinitialiserStyle}
              />
              <FormDetailPersonnel
                info={cv.personnel}
                onChange={majPersonnel}
                onReset={reinitialiserPersonnel}
              />
              <FormExperience
                experiences={cv.experiences}
                onChange={(liste) => maj("experiences", liste)}
                onReset={() => maj("experiences", [])}
              />
              <FormFormation
                formations={cv.formations}
                onChange={(liste) => maj("formations", liste)}
                onReset={() => maj("formations", [])}
              />
              <FormCompetences
                competences={cv.competences}
                onChange={(liste) => maj("competences", liste)}
                onReset={() => maj("competences", [])}
              />
              <FormLangues
                langues={cv.langues}
                onChange={(liste) => maj("langues", liste)}
                onReset={() => maj("langues", [])}
              />
              <FormInterets
                interets={cv.interets}
                onChange={(liste) => maj("interets", liste)}
                onReset={() => maj("interets", [])}
              />
            </div>
          </div>

          {/* Panneau aperçu */}
          <div className="preview-zone scrollable-preview flex h-full w-2/3 items-start justify-center bg-base-300 p-8 relative">
            <div className="absolute top-2 right-2 z-20 flex gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setVue3D(false)}
                disabled={vue3D}
                className={`btn btn-xs btn-ghost ${vue3D ? "opacity-50" : "btn-secondary"}`}
              >
                🖼️ 2D
              </button>
              <button
                type="button"
                onClick={() => setVue3D(true)}
                disabled={vue3D}
                className={`btn btn-xs btn-ghost ${vue3D ? "btn-secondary" : "opacity-50"}`}
              >
                🧊 3D
              </button>
            </div>
            {vue3D ? (
              <div key="cv-3d"> <CV3DViewer cv={cv} /> </div>
            ) : (
              <div key="cv-2d"> <CVPreview cv={cv} /> </div>
            )}
          </div>
        </section>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">
                Désolé, notre application est uniquement disponible sur
                ordinateur
              </h1>
              <Image
                src="/sad-sorry.gif"
                alt=""
                width={300}
                height={300}
                unoptimized
                className="my-6 mx-auto"
              />
              <p className="py-6">
                Pour créer votre CV, veuillez utiliser un ordinateur ou
                agrandir la fenêtre de votre navigateur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
