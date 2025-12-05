const PostItemSkeleton = () => {
    return (
        <div className="animate-pulse mb-0.5 md:mb-3 md:rounded-lg shadow border border-gray-200 overflow-hidden bg-white">

            <div className="w-full h-60 bg-gray-300"></div>

            <div className="p-3 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col gap-1">
                        <div className="w-24 h-4 bg-gray-300 rounded"></div>
                        <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
                </div>
            </div>

            <div className="flex gap-6 p-3 pt-0">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="w-8 h-3 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="w-8 h-3 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default PostItemSkeleton;