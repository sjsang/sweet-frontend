import PostItem from "./PostItem";
import PostItemSkeleton from "../posts/PostItemSkeleton";
import api from "../../api/axiosConfig";

const PostList = ({ posts, setPosts, loggedInUserId, loading, fromProfile, isMe }) => {
    if (loading) {
        return (
            <div>
                {Array.from({ length: 7 }).map((_, i) => (
                    <PostItemSkeleton key={i} />
                ))}
            </div>
        );
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            try {
                const res = await api.delete(`/posts/${id}`);
                if (res.data.success) {
                    setPosts(prev => prev.filter(post => post._id !== id));
                }
            } catch (error) {
                console.log('Có lỗi xảy ra khi xóa bài viết: ', error?.response?.data?.message);
            }
        }
    }

    return (
        <div>
            {posts.length !== 0
                ? (
                    posts.map(post => (
                        <PostItem
                            key={post._id}
                            post={post}
                            loggedInUserId={loggedInUserId}
                            fromProfile={fromProfile}
                            onDelete={handleDelete}
                            isMe={isMe}
                        />
                    ))
                ) : (
                    <p className="mt-5 text-gray-500 text-center">Không có bài viết.</p>
                )
            }
        </div>
    );
};

export default PostList;