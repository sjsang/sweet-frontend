import api from "../../api/axiosConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

const Login = () => {
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    }, []);

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const res = await api.post("/auth/login", form);

            if (res.data.success) {
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("userId", res.data.data._id);
                navigate("/");
            } else {
                setError(res.data.message || "Đăng nhập thất bại.");
            }
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            setError(
                err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."
            );
        }
    };

    const handleNavigate = () => navigate("/register");

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-2/3 flex flex-col justify-center px-10 md:px-80 bg-white">
                <div className="mb-7">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Đăng nhập
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Bạn chưa có tài khoản?
                        <span
                            className="text-indigo-600 ml-1 hover:underline cursor-pointer"
                            onClick={handleNavigate}
                        >
                            Đăng ký
                        </span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block font-medium mb-1">Tên người dùng</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 
                            focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 
                                focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 cursor-pointer text-gray-300"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>
                    </div>

                    {error && (<p className="text-red-600 text-sm">{error}</p>)}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                        font-medium py-2 rounded-lg transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="flex items-center my-3">
                    <hr className="grow border-gray-300" />
                    <span className="px-3 text-gray-500">hoặc</span>
                    <hr className="grow border-gray-300" />
                </div>

                <GoogleLoginButton />
            </div>

            <div className="hidden md:flex w-1/3">
                <img
                    src="/login_screen_banner.jpg"
                    alt="workspace"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

export default Login;
