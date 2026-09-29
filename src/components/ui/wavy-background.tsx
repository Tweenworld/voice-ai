"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

const DEFAULT_WAVE_COLORS = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#e879f9",
  "#22d3ee",
];

type WavyBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveYOffset?: number;
};

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  waveYOffset = 250,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const noise = createNoise3D();
    const waveColors = colors ?? DEFAULT_WAVE_COLORS;
    const speedFactor = speed === "slow" ? 0.001 : 0.002;
    let width = 0;
    let height = 0;
    let time = 0;
    let animationFrameId = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const render = () => {
      context.fillStyle = backgroundFill ?? "black";
      context.globalAlpha = waveOpacity;
      context.fillRect(0, 0, width, height);
      time += speedFactor;

      for (let waveIndex = 0; waveIndex < 5; waveIndex++) {
        context.beginPath();
        context.lineWidth = waveWidth ?? 50;
        context.strokeStyle = waveColors[waveIndex % waveColors.length];
        for (let x = 0; x < width; x += 5) {
          const y = noise(x / 800, 0.3 * waveIndex, time) * 100;
          context.lineTo(x, y + waveYOffset);
        }
        context.stroke();
        context.closePath();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundFill, colors, speed, waveOpacity, waveWidth, waveYOffset]);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{ filter: `blur(${blur}px)` }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
