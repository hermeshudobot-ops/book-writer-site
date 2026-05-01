export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-7xl mb-6">📭</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-6">This page doesn&apos;t exist or has been moved.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 transition-colors"
        >
          ← Back to Library
        </a>
      </div>
    </div>
  );
}
