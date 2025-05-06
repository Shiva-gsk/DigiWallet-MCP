import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[50%] dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Loading...
      </p>
    </div>
  );
}
