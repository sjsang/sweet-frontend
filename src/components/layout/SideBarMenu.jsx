import { useNavigate } from "react-router-dom";

const SideBarMenu = ({ activePage }) => {
    const navigate = useNavigate();
    const handleNavigate = (target) => navigate(target);

    const activeClass = 'bg-linear-to-r from-[#8114b0] via-[#ff4291] to-[#f7ff3c] bg-clip-text text-transparent md:bg-clip-border md:text-white';

    return (
        <div className="fixed bottom-0 md:sticky md:top-20 z-50 flex justify-evenly 
                        md:block w-full md:w-[90%] p-2 md:space-y-2
                         bg-white md:bg-transparent shadow md:shadow-none">

            <div className={`${activePage === 'home' ? `${activeClass}` : 'md:bg-white'} p-2 md:shadow rounded-lg`}>
                <div
                    className="cursor-pointer flex items-center gap-5"
                    onClick={() => handleNavigate('/')}
                >
                    <i class="fa-solid fa-earth-americas text-2xl"></i>
                    <p className="hidden md:block">Bảng tin</p>
                </div>
            </div>
            <div className={`${activePage === 'explore' ? `${activeClass}` : 'md:bg-white'} p-2 md:shadow rounded-lg`}>
                <div
                    className="cursor-pointer flex items-center gap-5"
                    onClick={() => handleNavigate('/explore')}
                >
                    <i class="fa-regular fa-compass text-2xl"></i>
                    <p className="hidden md:block">Khám phá</p>
                </div>
            </div>
            <div className={`${activePage === 'new' ? `${activeClass}` : 'md:bg-white'} p-2 md:shadow rounded-lg`}>
                <div
                    className="cursor-pointer flex items-center gap-5"
                    onClick={() => handleNavigate('/posts/new')}
                >
                    <i class="fa-regular fa-square-plus text-2xl"></i>
                    <p className="hidden md:block">Tạo bài viết</p>
                </div>
            </div>
        </div>
    )
}

export default SideBarMenu;