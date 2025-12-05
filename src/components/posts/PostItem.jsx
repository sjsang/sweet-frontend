import { useNavigate } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import { useRef, useState, useEffect } from 'react';

const PostItem = ({ post, loggedInUserId, fromProfile, onDelete, isMe }) => {
    const navigate = useNavigate();
    const goToDetail = () => navigate(`/posts/${post._id}`);

    const [openMenu, setOpenMenu] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                setOpenMenu(false);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [openMenu]);

    return (
        <div className='relative mb-0.5 md:mb-3 md:rounded-lg shadow border-gray-400 overflow-hidden'>
            <div ref={wrapperRef}>
                {fromProfile && isMe && (
                    <div
                        className="absolute top-0 right-0 text-lg p-1 px-2 text-black bg-white rounded-bl-lg cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(prev => !prev);
                        }}
                    >
                        <i className="fa-solid fa-ellipsis"></i>
                    </div>
                )}

                {openMenu && (
                    <div className="absolute right-5 top-7 bg-white border border-gray-200 shadow-lg rounded-lg p-2 w-fit z-50">
                        <p
                            className="py-1 px-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/posts/${post._id}/edit`);
                            }}
                        >
                            Chỉnh sửa
                        </p>
                        <p
                            className="py-1 px-2 rounded-lg hover:bg-gray-100 text-red-500 cursor-pointer text-sm"
                            onClick={(e) => {
                                setOpenMenu(false);
                                onDelete(post._id);
                            }}
                        >
                            Xóa
                        </p>
                    </div>
                )}
            </div>

            {post.image ? (
                <div className='bg-black flex items-center'>
                    <img
                        src={post.image}
                        className='w-full cursor-pointer'
                        onClick={goToDetail}
                    />

                    <div className='w-full absolute bottom-0 text-white bg-linear-to-t from-black/60 via-black-20 to-transparen'>
                        <div>
                            <div className='hidden md:flex'>
                                <PostHeader post={post} truncate={150} />
                            </div>
                            <div className='flex md:hidden'>
                                <PostHeader post={post} truncate={40} />
                            </div>
                        </div>
                        <PostFooter loggedInUserId={loggedInUserId} post={post} onCommentClick={goToDetail} />
                    </div>
                </div>
            ) : (
                <div className='w-full text-black bg-white'>
                    <PostHeader post={post} />
                    <PostFooter loggedInUserId={loggedInUserId} post={post} onCommentClick={goToDetail} />
                </div>
            )}
        </div>
    );
};

export default PostItem;