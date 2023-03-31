import Image from "next/image"
import { useEffect, useState } from "react"
interface Post {
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const response = await fetch(
        `https://6396aee2a68e43e41808fa18.mockapi.io/api/posts`,
      )
      const result = await response.json()
      setData(result)
      setDisplayedItems(result.slice(0, 5))
      setLoading(false)
    }
    fetchData()
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMore()
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [displayedItems])

  function loadMore() {
    const currentLength = displayedItems.length
    const newItems = data.slice(currentLength, currentLength + 5)
    setDisplayedItems([...displayedItems, ...newItems])
  }
  console.log(data)

  return (
    <div className="App bg-gray-800 min-h-screen text-white">
      <div className="container mx-auto p-4">
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 mb-4 shadow-md"
          >
            <div className="flex items-center mb-2">
              <Image
                src={item.authorAvatar}
                alt={item.authorName}
                className="w-10 h-10 rounded-full mr-4"
                width={50}
                height={50}
              />
              <div>
                <h3 className="font-bold text-xl">{item.authorName}</h3>
                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mb-4">{item.postText}</p>
            {item.postImage && (
              <Image
                width={50}
                height={50}
                src={item.postImage}
                alt="post-image"
                className="rounded-lg w-full"
              />
            )}
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center mb-4">
          <p>Loading...</p>
        </div>
      )}
    </div>
  )
}
