export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-28 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-56" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
                        <div className="space-y-3">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded" />
                                    <div className="flex-1 h-4 bg-gray-100 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
