import { useEffect, useState } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { RecentMatchLoading } from "../components/loading/LoadingRecentMatches"
import { Loading } from "../components/loading/SpinningLoader"
import { LeaderboardLoading } from "@/components"

interface Props {
  players: ILeaderboard[]
  region: string
  isLoading: boolean
}
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

const regions = ["latam", "na", "eu", "ap", "kr"]
const saveRegionToLocalStorage = (region: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedRegion", region)
  }
}

const loadRegionFromLocalStorage = (): string => {
  if (typeof window !== "undefined") {
    const region = localStorage.getItem("selectedRegion")
    return region ? region : "latam"
  }
  return "latam"
}
export default function Leaderboard({ players }: Props) {
  const [data, setData] = useState<ILeaderboardData>()
  const [itemsToShow, setItemsToShow] = useState(1000)
  const [loading, setLoading] = useState(false)
  // const [region, setRegion] = useState("latam")
  const [initialLoading, setInitialLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)

  const [currentPage, setCurrentPage] = useState("valorant")
  const [region, setRegion] = useState(loadRegionFromLocalStorage())

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(
        `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}`,
      )
      const jsonResult: ILeaderboardData = await result.json()
      setData(jsonResult)
      setFetchingData(false)
    }
    fetchData()
  }, [region])
  useEffect(() => {
    function handleScroll() {
      if (
        typeof window !== "undefined" &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !loading
      ) {
        setLoading(true)
        setTimeout(() => {
          setItemsToShow((prev) => prev + 1000)
          setLoading(false)
        }, 1500)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [loading])
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setInitialLoading(true)
    }
    const handleRouteChangeComplete = () => {
      setInitialLoading(false)
    }
    const handleRouteChangeError = () => {
      setInitialLoading(false)
    }

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)
    router.events.on("routeChangeError", handleRouteChangeError)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
      router.events.off("routeChangeError", handleRouteChangeError)
    }
  }, [router])
  const handleItemClick = () => {
    setInitialLoading(true)
  }
  useEffect(() => {
    saveRegionToLocalStorage(region)
  }, [region])

  console.log(region)

  return (
    <>
      <div className="container mx-auto p-4 min-h-[100px]">
        <div className="w-full md:w-1/2 lg:w-1/3 mx-auto">
          <label
            htmlFor="region"
            className="block text-sm font-medium text-white"
          >
            Select Region
          </label>
          <select
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-1 text-black block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 mx-auto mt-4">
          <label
            htmlFor="page"
            className="block text-sm font-medium text-white"
          >
            Select Page
          </label>
          <select
            id="page"
            name="page"
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(e.target.value)
              router.push(`/${e.target.value}`)
            }}
            className="mt-1 text-black block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="valorant">Valorant Leaderboard</option>
            <option value="posts">Posts</option>
          </select>
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        {initialLoading ? (
          <RecentMatchLoading />
        ) : fetchingData ? (
          <LeaderboardLoading />
        ) : (
          <>
            <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>
            <ul className="w-full">
              {data &&
                data.players &&
                data.players
                  .filter((player) => player.gameName)
                  .slice(0, itemsToShow)
                  .map((player, index) => (
                    <Link
                      key={index}
                      href={{
                        pathname: `/valorant/player/${player.gameName}#${player.tagLine}-${region}`,
                        query: { puuid: player.puuid },
                      }}
                    >
                      <li
                        onClick={handleItemClick}
                        className="mb-4 cursor-pointer hover:-translate-y-1 hover:scale-105 transition ease-in-out"
                      >
                        <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-lg p-4 shadow-md">
                          <div className="flex flex-row items-center">
                            <div className="text-white font-semibold text-2xl mr-4">
                              #{player.leaderboardRank}
                            </div>

                            <div className="text-white font-semibold text-2xl">
                              {player.gameName}
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between mt-2">
                            <div>
                              <span className="text-indigo-200 font-medium">
                                Wins:{" "}
                              </span>
                              {player.numberOfWins}
                            </div>
                            <div>
                              <span className="text-indigo-200 font-medium">
                                Rating:{" "}
                              </span>
                              {player.rankedRating}
                            </div>
                          </div>
                        </div>
                      </li>
                    </Link>
                  ))}
            </ul>
          </>
        )}
        {loading && <Loading />}
      </div>
    </>
  )
}
