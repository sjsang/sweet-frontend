import api from "../../api/axiosConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

const Register = () => {
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu không trùng khớp!");
            return;
        }

        try {
            const res = await api.post("/auth/register", form);

            if (res.data.success) {
                navigate("/login");
            } else {
                setError(res.data.message || "Đăng ký thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            setError(
                err.response?.data?.message ||
                "Đã xảy ra lỗi. Vui lòng thử lại sau."
            );
        }
    };

    const handleNavigate = () => navigate("/login");

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-2/3 flex flex-col justify-center px-10 md:px-80 bg-white">
                <div className="mb-7">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Bạn đã có tài khoản?
                        <span
                            className="text-indigo-600 ml-1 hover:underline cursor-pointer"
                            onClick={handleNavigate}
                        >
                            Đăng nhập
                        </span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block font-medium mb-1">Họ và tên</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Tên người dùng</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
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
                                className="absolute right-3 top-2.5 cursor-pointer text-gray-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 
                       focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <span
                                className="absolute right-3 top-2.5 cursor-pointer text-gray-300"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>
                    </div>

                    {error && (<p className="text-red-600 text-sm">{error}</p>)}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        Đăng ký
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
                    src="/register_screen_banner.jpg"
                    alt="workspace"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

export default Register;
