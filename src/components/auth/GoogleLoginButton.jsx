import { useEffect } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
    const navigate = useNavigate();

    const handleGoogleResponse = async (response) => {
        try {
            const res = await api.post("/auth/google", {
                idToken: response.credential
            });

            if (res.data.success) {
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("userId", res.data.data._id);
                navigate("/");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            if (err.response && err.response.data?.message) {
                alert(err.response.data.message);
            } else {
                console.error("Google login error:", err);
            }
        }
    };

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-login-btn"),
            {
                theme: "outline",
                size: "large",
            }
        );
    }, []);

    return (
        <div>
            <div id="google-login-btn"></div>
        </div>
    );
}