import Avatar from '@mui/material/Avatar';
import timeAgo from '../../functions/timeAgo';

import { useNavigate } from 'react-router-dom';

const PostHeader = ({ post, truncate }) => {
    const navigate = useNavigate();
    if (!post) return null;

    const truncatedText =
        truncate && post.content && post.content.length > truncate
            ? post.content.slice(0, truncate)
            : post.content;

    const isTruncated = truncate && post.content && post.content.length > truncate;

    return (
        <div className='space-y-3 p-3'>
            <div className="flex items-center gap-2">
                <Avatar src={post.user.avatar} sx={{ width: 50, height: 50 }} />
                <div>
                    <strong
                        className='cursor-pointer'
                        onClick={() => navigate(`/users/${post.user._id}`)}
                    >
                        {post.user.username}
                    </strong>
                    <p className='text-xs opacity-80'>{timeAgo(post.createdAt)}</p>
                </div>
            </div>

            {post.content && (
                <p>
                    {truncatedText}
                    {isTruncated && (
                        <>
                            ...{' '}
                            <span
                                onClick={() => navigate(`/posts/${post._id}`)}
                                className="font-medium text-sm cursor-pointer hover:underline"
                            >
                                Xem thêm
                            </span>
                        </>
                    )}
                </p>
            )}
        </div>
    );
};

export default PostHeader;