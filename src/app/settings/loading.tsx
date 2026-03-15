export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-28 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-64" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-6 flex items-center justify-between">
                        <div>
                            <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-36" />
                        </div>
                        <div className="h-9 bg-gray-200 rounded w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}
