"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Shuffle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TournamentDraw() {
  const [teams, setTeams] = useState<string[]>(Array(9).fill(""))
  const [seededTeams, setSeededTeams] = useState<number[]>([])
  const [groups, setGroups] = useState<{ group1: string[]; group2: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTeamChange = (index: number, value: string) => {
    const newTeams = [...teams]
    newTeams[index] = value
    setTeams(newTeams)
  }

  const handleSeededTeamToggle = (index: number) => {
    if (seededTeams.includes(index)) {
      setSeededTeams(seededTeams.filter((teamIndex) => teamIndex !== index))
    } else {
      if (seededTeams.length < 2) {
        setSeededTeams([...seededTeams, index])
      }
    }
  }

  const performDraw = () => {
    // Validate that all teams have names
    if (teams.some((team) => !team.trim())) {
      setError("Por favor, preencha o nome de todos os times.")
      return
    }

    // Validate that exactly 2 seeded teams are selected
    if (seededTeams.length !== 2) {
      setError("Por favor, selecione exatamente 2 times como cabeça de chave.")
      return
    }

    // Clear any previous errors
    setError(null)

    // Get non-seeded teams
    const nonSeededTeamIndices = Array.from({ length: 9 }, (_, i) => i).filter(
      (i) => !seededTeams.includes(i)
    )

    // Shuffle non-seeded teams
    const shuffledIndices = [...nonSeededTeamIndices].sort(() => Math.random() - 0.5)

    // Create groups
    const group1: string[] = [teams[seededTeams[0]]]
    const group2: string[] = [teams[seededTeams[1]]]

    // Add 3 more teams to group1 (total 4)
    for (let i = 0; i < 3; i++) {
      group1.push(teams[shuffledIndices[i]])
    }

    // Add 4 more teams to group2 (total 5)
    for (let i = 3; i < 7; i++) {
      group2.push(teams[shuffledIndices[i]])
    }

    setGroups({ group1, group2 })
  }

  const resetDraw = () => {
    setGroups(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Insira os nomes dos times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {teams.map((team, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Time ${index + 1}`}
                  value={team}
                  onChange={(e) => handleTeamChange(index, e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`seeded-${index}`}
                    checked={seededTeams.includes(index)}
                    onCheckedChange={() => handleSeededTeamToggle(index)}
                    disabled={!team.trim() || (seededTeams.length >= 2 && !seededTeams.includes(index))}
                  />
                  <Label htmlFor={`seeded-${index}`} className="text-sm">
                    Cabeça
                  </Label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button onClick={performDraw} disabled={groups !== null}>
              <Shuffle className="mr-2 h-4 w-4" />
              Realizar Sorteio
            </Button>
          </div>
        </CardContent>
      </Card>

      {groups && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Sorteio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Grupo 1 (4 times)</h3>
                <ul className="space-y-2">
                  {groups.group1.map((team, index) => (
                    <li key={index} className="rounded border p-2">
                      {index === 0 ? <strong>{team} (Cabeça)</strong> : team}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Grupo 2 (5 times)</h3>
                <ul className="space-y-2">
                  {groups.group2.map((team, index) => (
                    <li key={index} className="rounded border p-2">
                      {index === 0 ? <strong>{team} (Cabeça)</strong> : team}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-center">
              <Button onClick={resetDraw} variant="outline">
                Novo Sorteio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>

);
}
