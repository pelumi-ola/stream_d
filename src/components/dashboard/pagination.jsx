export function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2">
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
      <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded">1</button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
      <span className="px-3 py-1 text-sm text-gray-500">...</span>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">67</button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">68</button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
    </div>
  )
}
