// src/components/layout/AnimatedBackground.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadFull } from "tsparticles"; // <-- THIS IS THE CRITICAL CHANGE
import { useTheme } from "next-themes";

export const AnimatedBackground = () => {
  const [init, setInit] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine); // <-- THIS IS THE CRITICAL CHANGE
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {};

  const options: RecursivePartial<IOptions> = useMemo(() => {
    const config = {
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
        },
      },
      particles: {
        color: {
          value: resolvedTheme === 'dark' ? "#ffffff" : "#333333",
        },
        links: {
          color: resolvedTheme === 'dark' ? "#ffffff" : "#333333",
          distance: 150,
          enable: resolvedTheme === 'dark',
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          out_mode: "out",
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50,
        },
        opacity: {
          value: 0.2,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      detectRetina: true,
    };
    return config as RecursivePartial<IOptions>;
  }, [resolvedTheme]);

  if (!init) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </div>
  );
};