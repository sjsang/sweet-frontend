import { useState } from "react";
import api from "../../api/axiosConfig";

const PostFooter = ({ loggedInUserId, post, comments, onCommentClick }) => {
    const [isLiked, setIsLiked] = useState(post.likes.includes(loggedInUserId));
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const res = await api.post(`/posts/${post._id}/like`);
            if (res.data.success) {
                setIsLiked(!isLiked);
                setLikeCount(res.data.data.likes.length);
            }
        } catch (error) {
            console.log('Lỗi khi thích/bỏ thích bài viết: ', error);
        } finally {
            setLoading(false);
        }
    };

    const commentCount = comments?.length || post?.commentCount;

    return (
        <div className="flex gap-5 p-3 pt-0">
            <div className="flex gap-1">
                <i
                    className={`fa-heart text-2xl  cursor-pointer ${isLiked ? 'fa-solid text-rose-500' : 'fa-regular'}`}
                    onClick={handleLike}
                ></i>
                <span className="font-medium">{likeCount}</span>
            </div>
            <div className="flex gap-1">
                <i
                    className="fa-regular fa-comment text-2xl cursor-pointer"
                    onClick={onCommentClick}
                ></i>
                <span className="font-medium">{commentCount}</span>
            </div>
        </div>
    )
}

export default PostFooter;