export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-44 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-80" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="h-32 bg-gray-100 rounded-lg" />
                <div className="h-32 bg-gray-100 rounded-lg" />
                <div className="h-16 bg-gray-100 rounded-lg" />
            </div>
        </div>
    );
}
