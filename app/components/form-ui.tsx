"use client";

import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";

/** Classes communes pour rester cohérent dans tous les formulaires. */
export const inputCls = "input input-sm w-full";
export const textareaCls = "textarea textarea-sm w-full";
export const selectCls = "select select-sm w-full";

interface SectionProps {
  title: string;
  children: ReactNode;
  onReset?: () => void;
  action?: ReactNode;
}

/** Bloc de formulaire : titre en badge + bouton "réinitialiser" + contenu. */
export function Section({ title, children, onReset, action }: SectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="badge badge-secondary badge-outline">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          {onReset && (
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-circle"
              onClick={onReset}
              title="Réinitialiser cette section"
            >
              <RotateCw className="w-4" />
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/** Label + champ empilés verticalement. */
export function Field({ label, children, className = "" }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs font-medium opacity-70">{label}</span>
      {children}
    </label>
  );
}
