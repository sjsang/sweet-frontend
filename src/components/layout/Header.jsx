import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import Avatar from "@mui/material/Avatar";
import Notifications from "./Notifications";

const Header = ({ onClickLogo }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUser();

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            if (res.data.success) setUser(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy info:", error?.response?.data?.message);
            navigate('/login');
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="flex items-center w-full h-15 sticky top-0 z-50 bg-white shadow">
            <div className="w-[calc(11/15*100%+40px)] m-auto flex justify-between">
                <img
                    src="/main-logo.png"
                    className="w-10 cursor-pointer"
                    onClick={onClickLogo ?? (() => navigate('/'))}
                />

                <div className="flex items-center gap-5 relative">
                    <Notifications navigate={navigate} />

                    <div ref={dropdownRef} className="relative">
                        <Avatar
                            src={user.avatar}
                            sx={{ cursor: 'pointer', border: 2 }}
                            onClick={() => setOpenDropdown(prev => !prev)}
                        />

                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white z-20 shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                                <p
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        navigate(`/users/${user._id}`);
                                        setOpenDropdown(false);
                                    }}
                                >
                                    Trang cá nhân
                                </p>
                                <p
                                    className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;