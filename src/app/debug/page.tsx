export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Debug Page - App is Working!
        </h1>
        <p className="text-lg text-gray-600">
          If you can see this page, the Next.js app is deployed correctly.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Try accessing the root URL (/) for the main geography game.
        </p>
      </div>
    </div>
  );
}