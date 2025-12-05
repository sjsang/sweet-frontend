import { useEffect } from "react";
import Header from "../../components/layout/Header";
import SideBarMenu from "../../components/layout/SideBarMenu";
import api from "../../api/axiosConfig";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

const Explore = () => {
    const navigate = useNavigate();
    const [featuredUsers, setFeaturedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchFeaturedUsers();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {

            if (searchQuery.trim() === "") {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            fetchSearchUsers(searchQuery);

        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const fetchFeaturedUsers = async () => {
        try {
            const res = await api.get('/users/explore');
            if (res.data.success) {
                setFeaturedUsers(res.data.data)
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error?.response?.data?.message);
        }
    }

    const fetchSearchUsers = async (keyword) => {
        try {
            setIsSearching(true);
            const res = await api.get(`/users/search?q=${keyword}`);

            if (res.data.success) {
                setSearchResults(res.data.data);
            }
        } catch (error) {
            setSearchResults([]);
        }
    };

    return (
        <div>
            <Header />

            <div className="md:h-5"></div>

            <div className="md:flex md:justify-center md:gap-5">
                <div className="block md:w-1/5">
                    <SideBarMenu activePage={'explore'} />
                </div>

                <div className="md:w-1/3 h-fit flex flex-wrap gap-2 p-3 md:p-0">
                    <div className="w-full relative">
                        <div className="absolute top-1/2 left-2 pr-2 -translate-y-1/2 border-r border-r-gray-200">
                            <SearchIcon sx={{ color: '#99a1af ' }} />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full px-4 py-3 pl-12 outline-0 rounded-lg shadow bg-white placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {isSearching
                        ? (
                            searchResults.length > 0 ? (
                                <p className="w-full text-gray-600">Tìm thấy <strong>{searchResults.length}</strong> người dùng:</p>
                            ) : (
                                <p className="w-full text-gray-600">Không tìm thấy người dùng.</p>
                            )
                        ) : ""
                    }

                    {isSearching && searchResults.length > 0 && searchResults.map(u => (
                        <div
                            className="w-full md:w-[calc(50%-4px)] bg-white p-3 rounded-lg shadow flex gap-3 cursor-pointer"
                            key={u._id}
                            onClick={() => navigate(`/users/${u._id}`)}
                        >
                            <Avatar src={u.avatar} sx={{ width: 70, height: 70 }} />
                            <div className="space-y-0.5">
                                <p className="font-medium">{u.username}</p>
                                <p className="">{u.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {u.followers.length} người theo dõi
                                </p>
                            </div>
                        </div>
                    ))}

                    {!isSearching && featuredUsers && featuredUsers.map(u => (
                        <div
                            className="w-full md:w-[calc(50%-4px)] bg-white p-3 rounded-lg shadow flex gap-3 cursor-pointer"
                            key={u._id}
                            onClick={() => navigate(`/users/${u._id}`)}
                        >
                            <Avatar src={u.avatar} sx={{ width: 70, height: 70 }} />
                            <div className="space-y-0.5">
                                <p className="font-medium">{u.username}</p>
                                <p className="">{u.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {u.followers.length} người theo dõi
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block md:w-1/5"></div>
            </div>
        </div>
    );
}

export default Explore;