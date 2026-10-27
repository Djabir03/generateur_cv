// @ts-nocheck — Three.js / drei types sont incomplets avec Next.js 15
"use client";

import { useRef, ReactNode, RefObject, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text3D,
  useTexture,
  ContactShadows,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import type { CVData } from "@/app/lib/types";

interface Props {
  cv: CVData;
}

/** Photo de profil (à l'intérieur du Canvas pour pouvoir utiliser useTexture). */
function Photo3D({
  photo,
  couleur,
}: {
  photo: string;
  couleur: number;
}) {
  const texture = useTexture(photo || "/profile.jpg");
  return (
    <group>
      <mesh position={[-2.9, 0.6, 0.15]}>
        <planeGeometry args={[1.9, 1.9]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh
        position={[-2.9, 0.6, 0.16]}
        rotation-y={Math.PI / 2}
      >
        <planeGeometry args={[1.95, 1.95]} />
        <meshStandardMaterial
          color={couleur}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** Une barre de compétence 3D qui émerge du sol. */
function BarreCompetence({
  nom,
  niveau,
  couleur,
  index,
  total,
}: {
  nom: string;
  niveau: number;
  couleur: number;
  index: number;
  total: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animation d'apparition : la barre grandit de 0 à son niveau, depuis le sol.
  useFrame((state) => {
    if (!meshRef.current) return;
    const cible = niveau / 40; // hauteur max ~2.5 pour 100%
    const sy = THREE.MathUtils.lerp(meshRef.current.scale.y, cible, 0.06);
    meshRef.current.scale.set(1, sy, 1);
    meshRef.current.position.y = sy / 2; // base au sol
  });

  const x = (index - (total - 1) / 2) * 1.1;

  return (
    <group position={[x, 0, 2]}>
      <mesh ref={meshRef} position={[0, 0.05, 0]} scale={[0.7, 0.01, 0.7]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={couleur} transparent opacity={0.85} />
      </mesh>
      <ContactShadows opacity={0.6} scale={10} blur={1} far={3} />
      {/* Étiquette au-dessus de la barre */}
      <Text3D
        position={[0, 1.3, 0]}
        font-size={0.15}
        text={nom}
        fill={couleur}
        anchor="center"
      />
    </group>
  );
}

/** Bloc d'expérience flottant. */
function BlocExperience({
  poste,
  entreprise,
  periode,
  couleur,
  index,
  total,
}: {
  poste: string;
  entreprise: string;
  periode: string;
  couleur: number;
  index: number;
  total: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y =
      Math.sin(state.clock.getElapsedTime() + index) * 0.15;
  });

  const x = (index - (total - 1) / 2) * 1.6;
  const z = -3;

  return (
    <group position={[x, 0, z]}>
      <mesh ref={meshRef} scale={[1, 1, 1]}>
        <boxGeometry args={[1.2, 0.9, 0.3]} />
        <meshStandardMaterial color={couleur} transparent opacity={0.9} />
      </mesh>
      <Text3D
        position={[0, 0.6, 0.2]}
        font-size={0.18}
        line-height={1}
        text={poste || "Poste"}
        fill={0xffffff}
        stroke={0x000000}
        stroke-width={{ width: 0.02 }}
        curve-segments={4}
        bevel-thickness={0.01}
        bevel-size={0.01}
        bevel-enabled={false}
        anchor="center"
      />
      <Text3D
        position={[0, 0.25, 0.2]}
        font-size={0.12}
        line-height={1}
        text={entreprise || "Entreprise"}
        fill={0xeeeeee}
        anchor="center"
      />
      <Text3D
        position={[0, -0.05, 0.2]}
        font-size={0.1}
        line-height={1}
        text={periode || ""}
        fill={0xcccccc}
        anchor="center"
      />
    </group>
  );
}

/** Groupe qui tourne lentement (à l'intérieur du Canvas pour pouvoir utiliser useFrame). */
function AutoRotation({
  children,
  ref,
}: {
  children: ReactNode;
  ref: RefObject<THREE.Group>;
}) {
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.008;
  });
  return <group ref={ref}>{children}</group>;
}

export default function CV3DViewer({ cv }: Props) {
  const p = cv.personnel;
  const nom = `${p.prenom} ${p.nom}`.trim() || "Votre CV";
  const titre = p.titre || "Votre titre professionnel";
  const couleur = new THREE.Color(cv.style.couleur || "#fd6f9c").getHex();
  const groupeRef = useRef<THREE.Group>(null);

  const competences = cv.competences.filter((c) => c.nom.trim());
  const experiences = cv.experiences.filter(
    (e) => e.poste.trim() || e.entreprise.trim()
  );

  // Forcer un rendu manuel (onglet invisible → rAF en pause).
  const [tick, setTick] = useState(0);
  (window as any).__cv3dForceRender = () => setTick((t) => t + 1);

  return (
    <div
      className="relative w-full h-full min-h-[600px]"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#0b0f19",
        overflow: "hidden",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 2, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[6, 6, 6]} intensity={0.9} castShadow />
        <pointLight position={[-6, -2, 6]} intensity={0.5} castShadow />
        <spotLight position={[0, 8, 6]} angle={0.4} penumbra={0.5} intensity={1} castShadow />

        <OrbitControls makeDefault enableZoom enablePan dampingFactor={0.05} />

        <Stars radius={40} depth={50} count={400} factor={4} saturation={0} fade speed={1} />

        <ContactShadows opacity={0.4} scale={10} blur={2} far={6} />

        <AutoRotation key={tick} ref={groupeRef}>
          {/* Socle / sol */}
          <mesh position={[0, -2.2, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[24, 24]} />
            <meshStandardMaterial color={couleur} transparent opacity={0.15} />
          </mesh>

          {/* Carte principale (plan incliné) */}
          <mesh position={[0, 0.4, 0]} rotation-x={-0.35}>
            <planeGeometry args={[7.2, 5.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.4, 0.06]} rotation-x={-0.35}>
            <planeGeometry args={[7.3, 5.3]} />
            <meshStandardMaterial color={couleur} transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>

          <Photo3D photo={p.photo} couleur={couleur} />

          {/* Nom */}
          <Text3D
            position={[-2.6, 1.95, 0.2]}
            font-size={0.45}
            line-height={1}
            text={nom}
            fill={couleur}
            stroke={0x000000}
            stroke-width={{ width: 0.015 }}
            curve-segments={6}
            bevel-enabled={false}
            anchor="left"
          />
          {/* Titre */}
          <Text3D
            position={[-2.6, 1.45, 0.2]}
            font-size={0.22}
            line-height={1.1}
            text={titre}
            fill={0xffffff}
            anchor="left"
          />

          {/* À propos (lignes) */}
          {p.aPropos.trim() && (
            <group position={[-2.6, 0.85, 0.2]}>
              {p.aPropos
                .split("\n")
                .map((ligne, i) => (
                  <Text3D
                    key={i}
                    position={[0, -i * 0.18, 0]}
                    font-size={0.13}
                    line-height={1}
                    text={ligne}
                    fill={0xdddddd}
                    anchor="left"
                  />
                ))}
            </group>
          )}

          {/* Compétences en barres 3D */}
          {competences.length > 0 && (
            <group position={[-2.6, -0.9, 0.2]}>
              <Text3D
                position={[0, 0.25, 0]}
                font-size={0.18}
                text="COMPÉTENCES"
                fill={couleur}
                anchor="left"
              />
              {competences.map((c, i) => (
                <BarreCompetence
                  key={c.id}
                  nom={c.nom}
                  niveau={c.niveau}
                  couleur={couleur}
                  index={i}
                  total={competences.length}
                />
              ))}
            </group>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <group position={[1.6, 0.4, -0.5]}>
              <Text3D
                position={[0, 1.1, 0]}
                font-size={0.18}
                text="EXPÉRIENCES"
                fill={couleur}
                anchor="left"
              />
              {experiences.map((e, i) => (
                <BlocExperience
                  key={e.id}
                  poste={e.poste}
                  entreprise={e.entreprise}
                  periode={`${formatMois(e.debut)} – ${formatMois(e.fin)}`}
                  couleur={couleur}
                  index={i}
                  total={experiences.length}
                />
              ))}
            </group>
          )}

          {/* Langues */}
          {cv.langues.length > 0 && (
            <group position={[1.6, -1.4, -0.5]}>
              <Text3D position={[0, 0.25, 0]} font-size={0.16} text="LANGUES" fill={couleur} anchor="left" />
              {cv.langues.map((l, i) => (
                <Text3D
                  key={l.id}
                  position={[0, -i * 0.18, 0]}
                  font-size={0.12}
                  text={`• ${l.nom} — ${l.niveau}`}
                  fill={0xeeeeee}
                  anchor="left"
                />
              ))}
            </group>
          )}

          {/* Intérêts */}
          {cv.interets.length > 0 && (
            <group position={[1.6, -2.6, -0.5]}>
              <Text3D position={[0, 0.25, 0]} font-size={0.16} text="INTÉRÊTS" fill={couleur} anchor="left" />
              {cv.interets.map((int, i) => (
                <Text3D
                  key={int.id}
                  position={[0, -i * 0.18, 0]}
                  font-size={0.12}
                  text={`• ${int.nom}`}
                  fill={0xdddddd}
                  anchor="left"
                />
              ))}
            </group>
          )}
        </AutoRotation>
      </Canvas>

      {/* Overlay d'info */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-green-400 border border-green-500/30">
          Vue 3D — cliquez-glissez pour orbiter • molette pour zoomer
        </span>
        <span className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-gray-300">
          {cv.style.modele} • {cv.style.couleur}
        </span>
      </div>
    </div>
  );
}

/** Formate "2021-05" en "05/2021". */
function formatMois(valeur: string): string {
  if (!valeur) return "";
  const [annee, mois] = valeur.split("-");
  if (!annee || !mois) return valeur;
  return `${mois}/${annee}`;
}
