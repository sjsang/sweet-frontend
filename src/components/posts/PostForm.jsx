import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

const PostForm = ({ onSubmit, loading }) => {
    const navigate = useNavigate();
    const imageInputRef = useRef("");
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [form, setForm] = useState({
        content: '',
        image: null,
    });

    const [previewImage, setPreviewImage] = useState("");

    const handleClick = () => {
        imageInputRef.current.click();
    }

    const handleChange = (e) => {
        setForm({ ...form, content: e.target.value });
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm({ ...form, image: file });
        setPreviewImage(URL.createObjectURL(file));
    }

    useEffect(() => {
        const canSubmit = isEdit
            ? !!form.content
            : (!!form.content || !!form.image);

        setIsDisabled(!canSubmit);
    }, [form])

    const handleRemoveFile = () => {
        setForm({ ...form, image: null });
        setPreviewImage("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id)
            handleUpdate();
        else
            onSubmit(form);
    }

    useEffect(() => {
        if (!id)
            return;
        setIsEdit(true);
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            if (res.data.success) {
                const content = await res.data.data.post.content;
                const image = await res.data.data.post.image;
                setForm({
                    content, image
                })
                setPreviewImage(image)
            }
        } catch (error) {
            console.log('Có lỗi xảy ra khi lấy bài viết: ', error);
        }
    }

    const handleUpdate = async () => {
        try {
            const res = await api.patch(`/posts/${id}`, { content: form.content });
            if (res.data.success) {
                navigate(-1);
            }
        } catch (error) {
            console.log('Có lỗi xảy ra khi lấy bài viết: ', error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 rounded-lg shadow bg-white">
            <p className='pb-3 font-bold text-xl text-center border-b border-gray-200'>
                {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}
            </p>
            <textarea
                className="w-full min-h-50 outline-0"
                placeholder="Chia sẻ cảm xúc của bạn..."
                value={form.content}
                onChange={handleChange}
            ></textarea>


            {!isEdit &&
                <>
                    <input
                        ref={imageInputRef}
                        type="file"
                        className='hidden'
                        onChange={handleFileChange}
                    />
                    <div className='flex gap-2 items-center'>
                        <p className='font-medium text-gray-500'>Tải lên khoảnh khắc của bạn:</p>
                        <div className='p-2 w-fit rounded-[50%] cursor-pointer hover:bg-gray-100 transition-colors duration-200'>
                            <img
                                src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png"
                                onClick={handleClick}
                            />
                        </div>
                    </div>
                </>
            }

            {previewImage !== "" &&
                <div className='relative w-1/2 group mx-auto'>
                    <img
                        src={previewImage}
                        className={`${!isEdit ? 'group-hover:brightness-25' : ''} 
                         w-full rounded border border-gray-400 transition-all duration-200`} alt="ảnh bài viết"
                    />
                    {!isEdit &&
                        <i
                            className='fa-solid fa-trash opacity-0 text-3xl text-rose-500
                                        absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer
                                        hover:text-rose-600 group-hover:opacity-100
                                        transition-all duration-200'
                            onClick={handleRemoveFile}
                        ></i>}
                </div>}

            {isEdit &&
                <>
                    <p className="text-xs text-center text-gray-600">*Bạn không thể thay đổi hoặc xóa ảnh.</p>
                    <button
                        className='w-full py-1 px-2 rounded text-white transition-colors duration-200
                                  bg-gray-400 cursor-pointer hover:bg-gray-500'
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Hủy
                    </button>
                </>
            }
            <button
                disabled={isDisabled}
                className={`w-full py-1 px-2 rounded text-white transition-colors duration-200
                      ${(isDisabled || loading) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 cursor-pointer hover:bg-blue-600'} `
                }
                type="submit"
            >
                {isEdit ? 'Lưu' : 'Đăng'}
            </button>
        </form>
    );
};

export default PostForm;