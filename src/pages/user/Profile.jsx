import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useEffect, useState } from "react";
import ProfileHeader from "../../components/users/ProfileHeader";
import PostList from "../../components/posts/PostList";
import SideBarMenu from "../../components/layout/SideBarMenu";
import Header from "../../components/layout/Header";

const Profile = () => {
    const { id } = useParams();
    const loggedInUserId = localStorage.getItem('userId');

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState(null);
    const [isMe, setIsMe] = useState(false);

    useEffect(() => {
        fetchUserAndPosts();
        setIsMe(id === loggedInUserId);
    }, [id]);

    const fetchUserAndPosts = async () => {
        try {
            const res = await api.get(`/users/${id}`);
            if (res.data.success) {
                setUser(res.data.data.user);
                setPosts(res.data.data.posts);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error);
        }
    }

    return (
        <div>
            <Header />

            <div className="md:h-5"></div>

            <div className="md:flex md:justify-center md:gap-5">
                <div className="flex md:block md:w-1/5">
                    <SideBarMenu />
                </div>

                <div className="md:w-1/3">
                    {user && posts &&
                        <ProfileHeader user={user} posts={posts} loggedInUserId={loggedInUserId} />
                    }
                    <div className="md:mt-5">
                        {posts && <PostList posts={posts} setPosts={setPosts} loggedInUserId={loggedInUserId} fromProfile={true} isMe={isMe} />}
                        <div className="h-10 md:h-0"></div>
                    </div>
                </div>

                <div className="hidden md:block md:w-1/5"></div>
            </div>
        </div>
    );
}

export default Profile;