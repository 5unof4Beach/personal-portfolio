export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600 mx-auto"></div>
        <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait while we load your content</p>
      </div>
    </div>
  );
} 
