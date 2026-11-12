import { cn } from "@/lib/utils";
import { useState } from "react";

export interface PencilLoaderProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Component = ({
  className,
  size = 200,
  showText = false,
}: PencilLoaderProps = {}) => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={`${size}px`}
        width={`${size}px`}
        viewBox="0 0 200 200"
        className="pencil"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect height="30" width="30" ry="5" rx="5" />
          </clipPath>
        </defs>
        {/* Orbit track - soft mint/white contrast on dark green gradient */}
        <circle
          transform="rotate(-113,100,100)"
          strokeLinecap="round"
          strokeDashoffset="439.82"
          strokeDasharray="439.82 439.82"
          strokeWidth="2"
          stroke="rgba(255, 255, 255, 0.45)"
          fill="none"
          r="70"
          className="pencil__stroke"
        />
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            {/* Pencil Facet 1 (Mid Navy - Persian Educational Blue #1D557F) */}
            <circle
              transform="rotate(-90)"
              strokeDashoffset="402"
              strokeDasharray="402.12 402.12"
              strokeWidth="30"
              stroke="hsl(206, 62%, 42%)"
              r="64"
              className="pencil__body1"
            />
            {/* Pencil Facet 2 (Highlight Navy #2E79B4) */}
            <circle
              transform="rotate(-90)"
              strokeDashoffset="465"
              strokeDasharray="464.96 464.96"
              strokeWidth="10"
              stroke="hsl(206, 60%, 54%)"
              r="74"
              className="pencil__body2"
            />
            {/* Pencil Facet 3 (Brand Primary Deep Navy #123652) */}
            <circle
              transform="rotate(-90)"
              strokeDashoffset="339"
              strokeDasharray="339.29 339.29"
              strokeWidth="10"
              stroke="hsl(206, 64%, 26%)"
              r="54"
              className="pencil__body3"
            />
          </g>
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              {/* Eraser rubber in slate ice-blue */}
              <rect height="30" width="30" ry="5" rx="5" fill="hsl(206, 42%, 74%)" />
              <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="hsl(206, 42%, 62%)" />
              {/* Metallic ferrule collar in steel slate */}
              <rect height="20" width="30" fill="hsl(206, 15%, 88%)" />
              <rect height="20" width="15" fill="hsl(206, 15%, 72%)" />
              <rect height="20" width="5" fill="hsl(206, 15%, 80%)" />
              <rect height="2" width="30" y="6" fill="hsla(206, 25%, 15%, 0.25)" />
              <rect height="2" width="30" y="13" fill="hsla(206, 25%, 15%, 0.25)" />
            </g>
          </g>
          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            {/* Natural cedar wood cone */}
            <polygon points="15 0,30 30,0 30" fill="hsl(35, 75%, 72%)" />
            <polygon points="15 0,6 30,0 30" fill="hsl(35, 65%, 52%)" />
            {/* Graphite tip matching primary navy */}
            <polygon points="15 0,20 10,10 10" fill="hsl(206, 64%, 20%)" />
          </g>
        </g>
      </svg>
      {showText && (
        <span className="text-white font-medium text-sm tracking-wide">
          در حال بارگذاری سامانه...
        </span>
      )}
    </div>
  );
};

export default Component;
