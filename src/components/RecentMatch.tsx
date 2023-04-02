import Image from "next/image"
// interfaces.ts
export interface RecentMatchProps {
  character: string
  map: string
  game_length: number
  game_start: string
  team: string
  playerTeamWon: boolean
  AgentImage: string
  kills: number
  deaths: number
  assists: number
}

export function RecentMatch(props: RecentMatchProps) {
  const gameLengthInMinutes = Math.floor(props.game_length / 60000)

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <ul className="w-full">
        <li className="cursor-default hover:-translate-y-1 hover:scale-105 transition ease-in-out">
          <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-lg p-4 shadow-md">
            <div className="flex flex-row items-center">
              <Image
                src={props.AgentImage}
                alt="Agent"
                className="w-12 h-12 rounded-full mr-4"
                width={50}
                height={50}
                loading="lazy"
              />
              <div>
                <div className="text-white font-semibold text-2xl">
                  {props.map}
                </div>
                <div className="text-indigo-200 font-medium">
                  Agent: {props.character}
                </div>
                <div>{props.team}</div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between mt-4">
              <div className="flex flex-col items-center">
                <span className="text-indigo-200 font-medium">Result</span>
                <span
                  className={`text-2xl font-semibold ${
                    props.playerTeamWon ? "text-green-500" : "text-red-400"
                  } `}
                >
                  {props.playerTeamWon ? "Win" : "Loss"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-indigo-200 font-medium">KDA</span>
                <span className="text-2xl font-semibold">
                  {props.kills}/{props.deaths}/{props.assists}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-indigo-200 font-medium">Started</span>
                <span className="text-2xl font-semibold">
                  {new Date(props.game_start).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-indigo-200 font-medium">Duration</span>
                <span className="text-2xl font-semibold">
                  {gameLengthInMinutes}m
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}
