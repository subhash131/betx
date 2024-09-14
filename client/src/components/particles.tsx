"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

export const TsParticles = () => {
  const [init, setInit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    console.log(container);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true as any,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#f5f5f5",
              },
              links: {
                enable: false,
                color: {
                  value: "#333233",
                },
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "split",
                },
                random: true,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  height: 800,
                  width: 800,
                },
                value: 80,
              },
              opacity: {
                value: 1,
              },
              shape: {
                type: ["star"],
              },
              size: {
                value: { min: 1, max: 6 },
              },
            },
            detectRetina: false,
          }}
        />
      )}
    </>
  );
};
