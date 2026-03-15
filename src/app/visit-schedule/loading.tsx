export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-52 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="h-5 bg-gray-200 rounded w-36 mb-4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-full" />
                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                            <div className="h-4 bg-gray-100 rounded w-5/6" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
