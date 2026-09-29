"use client";

import { CinematicFilm } from "@/components/CinematicFilm";
import type { PreviewFilm } from "@/data/site";

export function ReactionFilms({ films }: { films: PreviewFilm[] }) {
  return (
    <div className="experience-reactions-films">
      {films.map((film) => (
        <CinematicFilm
          key={film.slug}
          film={film}
          posterPriority
        />
      ))}
    </div>
  );
}
