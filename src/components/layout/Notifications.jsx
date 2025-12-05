import timeAgo from "../../functions/timeAgo";
import Avatar from "@mui/material/Avatar";
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useRef, useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const Notifications = ({ navigate }) => {
    const notiRef = useRef(null);
    const [openNotiBox, setOpenNotiBox] = useState(false);
    const [badgeContent, setBadgeContent] = useState(0);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error?.response?.data?.message);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notiRef.current && !notiRef.current.contains(e.target)) {
                setOpenNotiBox(false);
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        const unreadCount = notifications.filter(n => !n.read).length;
        setBadgeContent(unreadCount);
    }, [notifications]);

    const formatNotification = (noti) => {
        switch (noti.type) {
            case "follow": return 'đã bắt đầu theo dõi bạn.';
            case "like": return 'đã thích bài viết của bạn.';
            case "comment": return 'đã bình luận bài viết của bạn.';
            default: return "";
        }
    };

    const handleClickNoti = async (id, senderId, postId, type) => {
        try {
            const res = await api.patch(`/notifications/${id}/read`);
            if (res.data.success) {
                setNotifications(prev =>
                    prev.map(n => n._id === id ? { ...n, read: true } : n)
                );

                if (type === 'follow') navigate(`/users/${senderId}`);
                if (type === 'like' || type === 'comment') navigate(`/posts/${postId}`);

                setOpenNotiBox(false);
            }
        } catch (error) {
            console.error("Lỗi đọc thông báo:", error?.response?.data?.message);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            setOpenMenuId(null);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    return (
        <div className="relative" ref={notiRef}>
            <Badge
                badgeContent={badgeContent}
                color="error"
                sx={{
                    "& .MuiBadge-badge": {
                        fontSize: "10px",
                        height: "18px",
                        minWidth: "18px",
                        padding: "0 4px",
                    }
                }}
            >
                <NotificationsNoneOutlinedIcon
                    sx={{ fontSize: 30, cursor: 'pointer' }}
                    onClick={() => setOpenNotiBox(prev => !prev)}
                />
            </Badge>

            {openNotiBox && (
                <div className="absolute top-10 -right-20 md:right-0 w-90 md:w-100 p-2 pr-0 overflow-hidden bg-white shadow-lg border border-gray-200 rounded-lg">
                    <p className="font-bold text-xl p-2">Thông báo</p>

                    {notifications.length !== 0 ? (
                        <div className="space-y-1 min-h-30 max-h-100 pr-2 overflow-y-scroll">
                            {notifications.map(noti => (
                                <div
                                    key={noti._id}
                                    className={`${noti.read ? '' : 'bg-rose-100'} px-2 py-1 rounded-2xl flex items-center gap-3 cursor-pointer relative group`}
                                    onClick={() =>
                                        handleClickNoti(noti._id, noti.sender?._id, noti.post?._id, noti.type)
                                    }
                                >
                                    <Avatar src={noti.sender.avatar} />

                                    <div className="flex-1">
                                        <p>
                                            <strong>{noti.sender.username}</strong> {formatNotification(noti)}
                                        </p>
                                        <span className="text-xs text-gray-500">{timeAgo(noti.createdAt)}</span>
                                    </div>

                                    <i
                                        className="fa-solid fa-ellipsis-vertical text-gray-500 opacity-100 md:opacity-0 p-2 group-hover:opacity-100 hover:text-black cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(prev => prev === noti._id ? null : noti._id);
                                        }}
                                    ></i>

                                    {openMenuId === noti._id && (
                                        <div className="absolute right-5 top-7 bg-white border border-gray-200 shadow-lg rounded-lg p-2 w-fit z-50">
                                            <p
                                                className="py-1 px-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(noti._id);
                                                }}
                                            >
                                                Đánh dấu đã đọc
                                            </p>
                                            <p
                                                className="py-1 px-2 rounded-lg hover:bg-gray-100 text-red-500 cursor-pointer text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(noti._id);
                                                }}
                                            >
                                                Xóa
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    ) : (<p className="p-2 text-sm">Không có thông báo.</p>)}
                </div>
            )}
        </div>
    )
}

export default Notifications;