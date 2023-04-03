import { useRouter } from "next/router"
import { RecentMatch, RecentMatchProps } from "@/components/RecentMatch"

import { GetStaticPaths, GetStaticProps } from "next"
export interface ILeaderboard {
  IsAnonymized: boolean
  IsBanned: boolean
  PlayerCardID: string
  TitleID: string
  competitiveTier: number
  gameName: string
  leaderboardRank: number
  numberOfWins: number
  puuid: string
  rankedRating: number
  tagLine: string
}
export interface ILeaderboardData {
  players: ILeaderboard[]
}
export interface RecentMatchesProps {
  metadata: MetadataProps
  players: {
    all_players: PlayerProps[]
  }
  teams: {
    blue: {
      has_won: boolean
    }
  }
}

export interface MetadataProps {
  map: string
  game_length: number
  game_start_patched: string
}

export interface PlayerProps {
  game_start: string | number | Date
  assists: number
  deaths: number
  kills: number
  playerTeamWon: boolean
  map: string
  AgentImage: string
  game_length: number
  character?: string
  puuid?: string
  team?: string
  assets?: AssestsProps
  stats?: StatsProps
}
interface AssestsProps {
  agent: {
    small: string
  }
}
interface StatsProps {
  kills: number
  deaths: number
  assists: number
}
interface Data {
  data: RecentMatchesProps[]
}
export default function RecentMatches({ data }: { data: Data }) {
  const { query } = useRouter()

  const recentMatches = data.data.map((agent: RecentMatchesProps) => {
    const foundPlayer = agent?.players?.all_players?.find((player) => {
      return player.puuid === query.puuid
    })

    const blueTeamWon = agent.teams.blue.has_won
    const playerTeamIsOnBlueTeam = foundPlayer?.team === "Blue"
    const playerTeamWon = blueTeamWon === playerTeamIsOnBlueTeam
    const map = agent.metadata.map
    const game_length = agent.metadata.game_length
    const game_start = agent.metadata.game_start_patched
    const team = foundPlayer?.team === "Blue" || "Red" ? "Blue" : "Red"

    return foundPlayer
      ? {
          character: foundPlayer.character,
          map: map,
          game_length: game_length,
          game_start: game_start,
          team: team,
          playerTeamWon: playerTeamWon,
          AgentImage: foundPlayer.assets?.agent.small,
          kills: foundPlayer.stats?.kills,
          deaths: foundPlayer.stats?.deaths,
          assists: foundPlayer.stats?.assists,
        }
      : null
  })

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Recent Matches</h1>

      {recentMatches.map((item, index) => {
        return <RecentMatch key={index} {...(item as RecentMatchProps)} />
      })}
    </div>
  )
}
export const getStaticPaths: GetStaticPaths = async () => {
  const regions = ["na", "eu", "ap", "kr", "latam"]
  const paths = []

  for (const region of regions) {
    const result = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}`,
    )
    const data: ILeaderboardData = await result.json()
    const regionPaths = data?.players?.map((player: ILeaderboard) => ({
      params: {
        name: `${encodeURIComponent(player.gameName)}#${encodeURIComponent(
          player.tagLine,
        )}-${region}`,
      },
    }))
    paths.push(...regionPaths)
  }

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name } = params ?? {}
  const [gameName, tagLine, region] = (name as string).split(/#|-/)
  try {
    const result = await fetch(
      `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(
        gameName,
      )}/${encodeURIComponent(tagLine)}`,
    )
    if (!result.ok) {
      throw new Error(
        `Error fetching data from API: ${result.status} ${result.statusText}`,
      )
    }
    const data: ILeaderboardData = await result.json()
    return {
      props: {
        data,
      },
      revalidate: 10,
    }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}
