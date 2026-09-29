"use client";

import { useState } from "react";
import { CinematicFilm } from "@/components/CinematicFilm";
import type { PreviewFilm } from "@/data/site";

export function ReactionFilms({ films }: { films: PreviewFilm[] }) {
  const [activeFilm, setActiveFilm] = useState<string | null>(null);

  return (
    <div className="experience-reactions-films">
      {films.map((film) => (
        <CinematicFilm
          key={film.slug}
          film={film}
          posterPriority
          inactive={activeFilm !== null && activeFilm !== film.slug}
          onViewingChange={(slug, playing) => {
            setActiveFilm((current) => playing ? slug : current === slug ? null : current);
          }}
        />
      ))}
    </div>
  );
}
