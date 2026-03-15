export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-36 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                            <div className="h-5 bg-gray-200 rounded w-32" />
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-24 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-40" />
                    </div>
                ))}
            </div>
        </div>
    );
}
