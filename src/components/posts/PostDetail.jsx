import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import PostHeader from './PostHeader';
import PostFooter from "./PostFooter";
import CommentItem from "../comments/CommentItem";
import Header from "../layout/Header";
import AutoFitImage from "../layout/AutoFitImage";

const PostDetail = () => {
    const { id } = useParams();
    const loggedInUserId = localStorage.getItem('userId');

    const [post, setPost] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [comment, setComment] = useState({ content: '', });

    const navigate = useNavigate();
    const handleExit = () => navigate(-1);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            if (res.data.success) {
                setPost(res.data.data.post);
                setPostComments(res.data.data.comments);
            }
        } catch (error) {
            console.log('Lỗi khi lấy bài viết: ', error);
        }
    }

    // Thêm bình luận
    const handleChange = (e) => {
        const value = e.target.value;
        setComment({ content: value });
        setIsActive(value.trim() === '');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/posts/${id}/comment`, comment);
            if (res.data.success) {
                setComment({ content: '' });
                const tempComment = {
                    ...res.data.data,
                    createdAt: new Date().toISOString()
                };
                setPostComments(prev => [tempComment, ...prev]);
                setIsActive(true);
            }
        } catch (error) {
            console.log('Lỗi khi thêm bình luận: ', error);
        }
    }

    // Xóa bình luận
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
            try {
                const res = await api.delete(`/comments/${id}`);
                if (res.data.success) {
                    setPostComments(prev => prev.filter(c => c._id !== id));
                }
            } catch (error) {
                alert(`Có lỗi khi xóa bình luận: ${error?.response?.data?.message || error.message}`);
            }
        }
    }

    // Sửa bình luận
    const handleUpdate = async (id, content) => {
        try {
            const res = await api.patch(`/comments/${id}`, { content });
            if (res.data.success) {
                setPostComments(prev => prev.map(comment => comment._id === id ? { ...comment, content } : comment));
            }
        } catch (error) {
            alert(`Có lỗi khi xóa bình luận: ${error?.response?.data?.message || error.message}`);
        }
    }

    return (
        <div>
            <Header />
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-3/4 md:h-[calc(100vh-60px)] flex items-center justify-center bg-neutral-950 md:sticky top-15">
                    {post?.image
                        ? (
                            <AutoFitImage src={post.image} alt="preview" />)
                        : (
                            <div className="text-gray-400">
                                Không có ảnh.
                            </div>)
                    }
                </div>

                <div className="w-full md:w-1/4 md:h-[calc(100vh-60px)] overflow-x-hidden relative space-y-3">
                    <div className='sticky top-0 z-9 bg-white shadow'>
                        <div className="flex justify-between">
                            <PostHeader post={post} />
                            <i
                                className="fa-solid fa-xmark text-lg text-gray-500 m-3 cursor-pointer"
                                onClick={handleExit}
                            ></i>
                        </div>
                        {post && comment && <PostFooter loggedInUserId={loggedInUserId} post={post} comments={postComments} />}
                    </div>

                    <div className="space-y-2 px-3">
                        {
                            postComments && postComments.length > 0
                                ? (postComments.map((c) => (
                                    <CommentItem key={c._id} comment={c} loggedInUserId={loggedInUserId} onClickDeleteComment={handleDelete} onUpdateComment={handleUpdate} />
                                )))
                                : (<p className="text-sm text-gray-500">Chưa có bình luận nào.</p>)
                        }
                    </div>

                    <div className="h-10"></div>

                    <div className="fixed right-0 bottom-0 w-full md:w-1/4 p-3 bg-white border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="flex">
                            <input
                                type="text"
                                value={comment.content}
                                placeholder='Viết bình luận...'
                                onChange={handleChange}
                                className="flex-1 outline-0"
                            />
                            <button type='submit' disabled={isActive} className={`${isActive ? ' opacity-50' : ''} cursor-pointer`}>
                                <i
                                    className="fa-solid fa-paper-plane text-blue-500 text-2xl"
                                ></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;