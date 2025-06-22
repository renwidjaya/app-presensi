import { login } from "../../api";
import Label from "../form/Label";
import React, { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useNavigate, useLocation } from "react-router-dom";

export default function SignInForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValid) {
      setError("Email tidak valid");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login gagal";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Login Admin
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                className={`${!isEmailValid && email ? "border-red-500" : ""}`}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Kata Sandi</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata sandi"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {showPassword ? (
                    <span className="text-black">🙈</span> // untuk efek lucu
                  ) : (
                    <span className="text-black">👁️</span>
                  )}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading || !isEmailValid}
            >
              {loading ? "LOADING..." : "LOGIN"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
