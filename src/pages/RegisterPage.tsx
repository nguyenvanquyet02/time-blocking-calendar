// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);
        try {
            await register({ email, password, displayName });
            navigate("/calendar", { replace: true });
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                setError("Email này đã được sử dụng bởi một tài khoản khác.");
            } else {
                setError(err.message || "Đăng ký tài khoản thất bại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Tạo tài khoản mới
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Bắt đầu quản lý thời gian hiệu quả hơn
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Tối thiểu 6 ký tự"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50 text-sm"
                    >
                        {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Đã có tài khoản?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
