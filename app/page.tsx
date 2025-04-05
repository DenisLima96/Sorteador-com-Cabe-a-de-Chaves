import { TournamentDraw } from "@/components/tournament-draw"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Sorteador com Cabeça de Chaves</h1>
      <TournamentDraw />
    </main>
  )
}

