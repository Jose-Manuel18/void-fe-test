import Image from "next/image"
import { useEffect, useState } from "react"
import { debounce } from "lodash"
import Link from "next/link"
import { Loading } from "../components/loading/SpinningLoader"
export interface Post {
  authorAvatar: string
  authorName: string
  createdAt: string
  id: string
  postImage: string
  postText: string
}
export default function Posts() {
  const [data, setData] = useState<Post[]>([])
  const [displayedItems, setDisplayedItems] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [endReached, setEndReached] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://6396aee2a68e43e41808fa18.mockapi.io/api/posts`,
      )
      const result = await response.json()
      setData(result)
      setDisplayedItems(result.slice(0, 5))
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setEndReached(true)
        setTimeout(() => {
          loadMore()
          setEndReached(false)
        }, 1500)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedItems])

  const searchPosts = debounce(async (query: string) => {
    if (query) {
      const filteredData = data.filter(
        (item) =>
          item.authorName.toLowerCase().includes(query.toLowerCase()) ||
          item.postText.toLowerCase().includes(query.toLowerCase()),
      )
      setDisplayedItems(filteredData)
    } else {
      setDisplayedItems(data.slice(0, 5))
    }
  }, 500)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    searchPosts(e.target.value)
  }

  function loadMore() {
    const currentLength = displayedItems.length
    const newItems = data.slice(currentLength, currentLength + 5)
    setDisplayedItems([...displayedItems, ...newItems])
  }

  console.log(data)

  return (
    <div className="App bg-gray-800 min-h-screen text-white">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for authors..."
            className="w-full p-3 rounded-md text-white"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 mb-4 shadow-md transition ease-in-out hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/posts/${item.id}`} legacyBehavior>
              <a>
                <div className="flex items-center mb-2 cursor-pointer">
                  <Image
                    width={40}
                    height={40}
                    src={item.authorAvatar}
                    alt={item.authorName}
                    className="w-10 h-10 rounded-full mr-4 bg-cover"
                  />
                  <div>
                    <h3 className="font-bold text-xl">{item.authorName}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="mb-4">{item.postText}</p>
              </a>
            </Link>
          </div>
        ))}
        {endReached && <Loading posts />}
      </div>
    </div>
  )
}
