'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">JavaScript Test Page</h1>
        <p className="text-lg text-gray-700 mb-6">If you can see this page, JavaScript is working!</p>
        <button 
          onClick={() => alert('JavaScript is working!')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Click me to test JavaScript
        </button>
      </div>
    </div>
  )
}