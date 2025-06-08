import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Login Admin
        </h2>
        <form>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12l-4-4-4 4m0 0l4 4 4-4m-4-4v12"
                    />
                  </svg>
                </span>
                <Input type="email" placeholder="Email" className="pl-10" />
              </div>
            </div>
            <div>
              <Label>Kata sandi</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata sandi"
                  className="pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeCloseIcon className="w-5 h-5 text-gray-400" />
                  )}
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                navigate("/");
              }}
            >
              LOGIN
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
