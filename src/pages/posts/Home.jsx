import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import PostList from "../../components/posts/PostList";
import SideBarMenu from "../../components/layout/SideBarMenu";
import Header from "../../components/layout/Header";

const Home = () => {
    const loggedInUserId = localStorage.getItem('userId');

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/posts');
            if (res.data.success)
                setTimeout(() => {
                    setPosts(res.data.data);
                    setLoading(false);
                }, 500);
        } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error?.response?.data?.message);
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        fetchPosts();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div>
            <Header onClickLogo={handleRefresh} />

            <div className="md:h-5"></div>

            <div className="md:flex md:justify-center md:gap-5">
                <div className="block md:w-1/5">
                    <SideBarMenu activePage={'home'} />
                </div>

                <div className="md:w-1/3">
                    <PostList posts={posts} loggedInUserId={loggedInUserId} loading={loading} />
                    <div className="h-10 md:h-0"></div>
                </div>

                <div className="hidden md:block md:w-1/5"></div>
            </div>
        </div>
    );
};

export default Home;