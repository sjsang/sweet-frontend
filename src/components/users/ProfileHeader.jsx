import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

const ProfileHeader = ({ user, posts, loggedInUserId }) => {
    const { id } = useParams();

    const [displayUser, setDisplayUser] = useState(user);
    const [postsLength, setPostsLength] = useState(posts.length);
    const [isAnotherUser, setIsAnotherUser] = useState(loggedInUserId !== id);
    const [isFollowed, setIsFollowed] = useState(
        user.followers.map(f => f._id.toString()).includes(loggedInUserId)
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        username: user.username,
        name: user.name,
        avatar: null
    });
    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        setDisplayUser(user);
        setPostsLength(posts.length);
        setIsFollowed(
            user.followers.map(f => f._id.toString()).includes(loggedInUserId)
        );
    }, [user, posts]);

    useEffect(() => {
        setIsAnotherUser(loggedInUserId !== id);
    }, [id]);

    const toggleFollow = async () => {
        try {
            const res = await api.post(`/users/${displayUser._id}/follow`);
            if (res.data.success) {
                setDisplayUser(res.data.data.user);
                setIsFollowed(!isFollowed);
            }
        } catch (error) {
            console.log('Có lỗi khi theo dõi/bỏ theo dõi: ', error);
        }
    }

    const handleSave = async () => {
        if (loading) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("name", editedData.name);
        formData.append("username", editedData.username);
        if (editedData.avatar) {
            formData.append("avatar", editedData.avatar);
        }

        try {
            const res = await api.patch(`/users/${displayUser._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                setDisplayUser(res.data.data);
                setIsEditing(false);
            }
        } catch (err) {
            console.log("Lỗi cập nhật:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedData({
            username: displayUser.username,
            name: displayUser.name,
            avatar: null
        });
        setIsEditing(false);
    };

    const handleDeleteUser = async () => {
        if (!deletePassword) {
            setDeleteError("Vui lòng nhập mật khẩu.");
            return;
        }

        try {
            const res = await api.delete(`/users/${displayUser._id}`, {
                data: { password: deletePassword }
            });

            if (res.data.success) {
                window.location.href = "/login";
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setDeleteError("Mật khẩu không đúng.");
            } else if (error.response?.data?.message) {
                setDeleteError(error.response.data.message);
            } else {
                setDeleteError("Có lỗi xảy ra. Vui lòng thử lại.");
            }
        }
    };

    const handleDeleteUserWithGoogleAccount = async () => {
        if (user.provider !== 'google')
            return;
        if (confirm('Bạn có chắc chắn muốn xóa tài khoản không?')) {
            try {
                const res = await api.delete(`/users/${displayUser._id}`);

                if (res.data.success) {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.log('Có lỗi xảy ra khi xóa tài khoản: ', error?.response?.data?.message);
            }
        }
    }

    return (
        <div className="bg-white p-3 md:rounded-lg shadow">
            <div className="flex gap-3 relative">
                <input
                    type="file"
                    className="hidden"
                    id="avatarInput"
                    onChange={(e) =>
                        setEditedData({ ...editedData, avatar: e.target.files[0] })
                    }
                />

                <div
                    className={`${isEditing ? "cursor-pointer" : ""} relative`}
                    onClick={() => isEditing && document.getElementById("avatarInput").click()}
                >
                    <Avatar
                        src={
                            editedData.avatar
                                ? URL.createObjectURL(editedData.avatar)
                                : displayUser.avatar
                        }
                        sx={{ width: 100, height: 100 }}
                        className={isEditing ? "opacity-25" : ""}
                    />
                    {isEditing && <i class="fa-solid fa-camera text-3xl text-gray-800 absolute top-1/2 left-1/2 -translate-1/2"></i>}
                </div>

                <div className="flex flex-col grow">
                    <div>
                        {isEditing ? (
                            <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                    <input
                                        className="border border-gray-300 rounded outline-0 px-2 py-1 w-full"
                                        value={editedData.username}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, username: e.target.value })
                                        }
                                    />
                                    <input
                                        className="border border-gray-300 rounded outline-0 px-2 py-1 w-full my-2"
                                        value={editedData.name}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, name: e.target.value })
                                        }
                                    />
                                </div>

                                {isEditing && (
                                    <div className="h-fit flex gap-1">
                                        <button
                                            className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-green-600'}
                                                        py-1 px-2 bg-green-500 text-white rounded
                                                        transition-colors duration-200`
                                            }
                                            onClick={handleSave}
                                            disabled={loading}
                                        >
                                            Lưu
                                        </button>

                                        <button
                                            className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-rose-600'}
                                                            py-1 px-2 bg-rose-500 text-white rounded
                                                            transition-colors duration-200`
                                            }
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="font-bold text-lg">{displayUser.username}</p>
                                <p className="md:mt-1">{displayUser.name}</p>
                            </>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="flex gap-5 mt-auto">
                            <div className="flex flex-col md:flex-row md:gap-1">
                                <strong>{postsLength}</strong>
                                <p className="text-xs md:text-base">bài viết</p>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-1">
                                <strong>{displayUser.followers.length}</strong>
                                <p className="text-xs md:text-base">người theo dõi</p>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-1">
                                <strong>{displayUser.following.length}</strong>
                                <p className="text-xs md:text-base">đang theo dõi</p>
                            </div>
                        </div>
                    )}
                </div>

                {!isEditing && !isAnotherUser && (
                    <i
                        className="fa-solid fa-ellipsis absolute right-0 cursor-pointer"
                        onClick={() => setOpenMenu(prev => !prev)}
                    ></i>
                )}
                {openMenu && !isAnotherUser && (
                    <div className="absolute right-4 top-4 bg-white border border-gray-200 shadow-lg rounded-lg p-2 w-fit z-30">
                        <p
                            className="py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                                setIsEditing(true);
                                setOpenMenu(false);
                            }}
                        >
                            Chỉnh sửa
                        </p>
                        <p
                            className="py-2 px-3 rounded-lg hover:bg-gray-100 text-red-500 cursor-pointer text-sm"
                            onClick={() => {
                                setShowDeleteModal(true);
                                setOpenMenu(false);
                                handleDeleteUserWithGoogleAccount();
                            }}
                        >
                            Xóa tài khoản
                        </p>
                    </div>
                )}
                {showDeleteModal && user.provider !== 'google' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-5 rounded shadow-lg w-80">
                            <h3 className="font-bold text-lg mb-3 text-center">Xác nhận xóa tài khoản</h3>

                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                className="w-full border rounded px-2 py-1 outline-0"
                                value={deletePassword}
                                onChange={(e) => {
                                    setDeletePassword(e.target.value);
                                    setDeleteError("");
                                }}
                            />

                            {deleteError && (
                                <p className="text-red-500 text-sm mt-1">{deleteError}</p>
                            )}

                            <div className="flex justify-end mt-4 gap-2">
                                <button
                                    className="px-3 py-1 bg-gray-400 text-white rounded"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletePassword("");
                                        setDeleteError("");
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded"
                                    onClick={handleDeleteUser}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center">
                {isAnotherUser ? (
                    isFollowed ? (
                        <p
                            className="mt-3 py-1 px-2 rounded text-white bg-rose-500 hover:bg-rose-600 transition-colors duration-300 ease-in-out cursor-pointer"
                            onClick={toggleFollow}
                        >
                            Bỏ theo dõi
                        </p>
                    ) : (
                        <p
                            className="mt-3 py-1 px-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-300 ease-in-out cursor-pointer"
                            onClick={toggleFollow}
                        >
                            Theo dõi
                        </p>
                    )
                ) : ''}
            </div>
        </div>
    );
};

export default ProfileHeader;