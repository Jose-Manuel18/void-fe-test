interface LoadingProps {
  posts?: boolean
}
export function Loading({ posts }: LoadingProps) {
  return (
    <div className="flex items-center justify-center h-10">
      <div
        className={`animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 ${
          posts ? "border-y-blue-600" : "border-y-fuchsia-600"
        }`}
      ></div>
    </div>
  )
}
