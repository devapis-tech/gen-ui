"use client";

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="text-gray-600">This is a test page to verify the 3-column layout works correctly.</p>
      
      <div className="mt-8 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Layout Test</h2>
          <p className="text-gray-600">If you can see this content with proper spacing, the layout is working.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Sidebar Test</h2>
          <p className="text-gray-600">You should see the main sidebar on the left and chat sidebar on the right.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Responsive Test</h2>
          <p className="text-gray-600">Try resizing the browser to test responsive behavior.</p>
        </div>
      </div>
    </div>
  );
}
