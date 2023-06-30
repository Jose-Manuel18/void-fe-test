import { GetServerSideProps } from "next"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Post } from "../posts"
export default function FullPost({ post }: { post: Post }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (router.isFallback || loading) {
    return <p>Loading...</p>
  }
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-700 rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-2 bg-cover">
          <Image
            width={400}
            height={400}
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full mr-4 "
          />
          <div>
            <h3 className="font-bold text-xl">{post.authorName}</h3>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="mb-4">{post.postText}</p>
        {post.postImage && (
          <div className="bg-cover">
            <Image
              width={400}
              height={400}
              src={post.postImage}
              alt="post-image"
              className="rounded-lg w-full "
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  )
}
// export const getStaticPaths: GetStaticPaths = async () => {
//   const response = await fetch(
//     `https://6396aee2a68e43e41808fa18.mockapi.io/api/posts`,
//   )
//   const posts: Post[] = await response.json()
//   const paths = posts.map((post) => ({
//     params: { id: post.id },
//   }))
//   return { paths, fallback: false }
// }
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params ?? {}
  try {
    const response = await fetch(
      `https://6396aee2a68e43e41808fa18.mockapi.io/api/posts/${id}`,
    )
    if (!response.ok) {
      console.error("Response error", response.status, response.statusText)
      throw new Error("API response was not ok")
    }
    const post: Post = await response.json()
    return { props: { post } }
  } catch (error) {
    console.error("Fetch error", error)
    return { props: {} }
  }
}
