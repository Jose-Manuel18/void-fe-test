import { useRouter } from "next/router"
import { RecentMatch } from "@/components/RecentMatch"

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
  character: string
  puuid: string
  team: "Blue" | "Red"
  assets: {
    agent: {
      small: string
    }
  }
  stats: {
    kills: number
    deaths: number
    assists: number
  }
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
          AgentImage: foundPlayer.assets.agent.small,
          kills: foundPlayer.stats.kills,
          deaths: foundPlayer.stats.deaths,
          assists: foundPlayer.stats.assists,
        }
      : null
  })

  console.log(data.data)

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Recent Matches</h1>

      {recentMatches.map((item, index) => {
        return <RecentMatch key={index} {...item} />
      })}
    </div>
  )
}
export const getStaticPaths: GetStaticPaths = async () => {
  const result = await fetch(
    `https://api.henrikdev.xyz/valorant/v2/leaderboard/latam`,
  )
  const data: ILeaderboardData = await result.json()
  const paths = data?.players?.map((player: ILeaderboard) => ({
    params: { name: `${player.gameName}#${player.tagLine}-latam` }, // add the region as part of the name parameter
  }))
  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name } = params ?? {}
  const [gameName, tagLine, region] = (name as string).split(/#|-/) // split the name string using both '#' and '-' as separators

  try {
    console.time("API request")
    const result = await fetch(
      `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${gameName}/${tagLine}`,
    )
    console.timeEnd("API request")
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
    }
  } catch (error) {
    console.error(error)

    return {
      notFound: true,
    }
  }
}
