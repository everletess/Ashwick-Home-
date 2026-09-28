import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import { FABRICS, SWATCH_ORDER, type FabricId } from "@/lib/products";

type PhotoProps = {
  src?: PhotoKey;
  label: string;
  className?: string;
  /** Fill the positioned parent (object-fit comes from CSS). Otherwise render at intrinsic ratio. */
  fill?: boolean;
  sizes?: string;
  preload?: boolean;
};

/** A photo, or the hatched placeholder used where photography hasn't been supplied. */
export function Photo({ src, label, className, fill, sizes = "100vw", preload }: PhotoProps) {
  if (!src) {
    return (
      <div className={"ph " + (className ?? "")}>
        <span>Photography · {label}</span>
      </div>
    );
  }
  return (
    <Image
      src={PHOTOS[src]}
      alt={label}
      className={className}
      fill={fill}
      sizes={sizes}
      preload={preload}
      placeholder="blur"
    />
  );
}

type SwatchProps = { f: FabricId; size?: number; on?: boolean; onClick?: () => void };

export function Swatch({ f, size = 96, on, onClick }: SwatchProps) {
  const F = FABRICS[f];
  const className = "chip tex-" + F.tex + (on ? " on" : "");
  const style = { width: size, height: size, background: F.swatch };
  if (onClick) {
    return <button type="button" className={className} title={F.label} aria-label={F.label} aria-pressed={on} onClick={onClick} style={style} />;
  }
  return <div className={className} title={F.label} aria-label={F.label} style={style} />;
}

/** 2×2 grid of fabric swatches with labels, used on Home and Design your own. */
export function SwatchGrid({ className = "swgrid" }: { className?: string }) {
  return (
    <div className={className}>
      {SWATCH_ORDER.map((f) => (
        <div className={"swt tex-" + FABRICS[f].tex} key={f} style={{ background: FABRICS[f].swatch }}>
          <span className={f === "leather" ? "lt" : ""}>{FABRICS[f].label}</span>
        </div>
      ))}
    </div>
  );
}
