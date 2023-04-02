export function RecentMatchLoading() {
  const items = Array.from({ length: 7 }).map((_, index) => ({
    id: index,
  }))

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-10 mb-1">
        <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-y-fuchsia-600"></div>
      </div>
      <ul className="w-full">
        {items.map((item) => (
          <li key={item.id} className="mb-4">
            <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-lg p-4 shadow-md">
              <div className="flex flex-row items-center">
                <div className="animate-pulse rounded-full h-12 w-12 bg-stone-600 mr-4"></div>
                <div>
                  <div className="animate-pulse rounded-full h-5 w-40 bg-stone-600"></div>
                  <div className="animate-pulse rounded-full h-3 w-24 bg-stone-600 mt-2"></div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between mt-2">
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between mt-2">
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between mt-2">
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between mt-2">
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
                <div>
                  <span className="animate-pulse rounded-full h-3 w-16 bg-stone-600"></span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
