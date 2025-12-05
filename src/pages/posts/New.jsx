import { useState } from "react";
import api from "../../api/axiosConfig";
import PostForm from "../../components/posts/PostForm";
import { useNavigate } from "react-router-dom";
import SideBarMenu from "../../components/layout/SideBarMenu";
import Header from "../../components/layout/Header";

const New = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async (form) => {
        if (loading) return;

        setLoading(true);

        try {
            const formData = new FormData();
            if (form.content)
                formData.append('content', form.content);
            if (form.image)
                formData.append('image', form.image);

            const res = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data.success)
                navigate('/');
            else
                console.log('Lỗi khi tạo bài viết: ', res.data.message);
        } catch (error) {
            console.log('Lỗi khi tạo bài viết: ', error);
        }
    }

    return (
        <div>
            <Header />

            <div className="md:h-5"></div>

            <div className="md:flex md:justify-center md:gap-5">
                <div className="flex md:block md:w-1/5">
                    <SideBarMenu activePage={'new'} />
                </div>

                <div className="md:w-1/3 p-3 md:p-0">
                    <PostForm onSubmit={handleCreatePost} loading={loading} />
                </div>

                <div className="hidden md:block md:w-1/5"></div>
            </div>
        </div>
    );
};

export default New;