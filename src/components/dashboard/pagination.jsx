export function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2">
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-black">
        Previous
      </button>
      <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded dark:text-black">
        1
      </button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-black">
        2
      </button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-black">
        3
      </button>
      <span className="px-3 py-1 text-sm text-gray-500 dark:text-black">
        ...
      </span>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-black">
        67
      </button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-black">
        68
      </button>
      <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-black">
        Next
      </button>
    </div>
  );
}
