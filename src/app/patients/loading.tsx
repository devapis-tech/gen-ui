export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-56 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                        <div className="h-8 bg-gray-300 rounded w-16" />
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                </div>
                <div className="p-6 space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}
