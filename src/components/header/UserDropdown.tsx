import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import LocalStorageService, { UserData } from "../../utils/storage";

export default function UserDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("/images/default.jpg");

  useEffect(() => {
    try {
      const profile = LocalStorageService.getUserData();
      console.log("UserDropdown loaded profile:", profile); // Debug log

      if (profile && typeof profile === "object") {
        setUser(profile);

        // Jika ada foto profil yang valid, gunakan
        if (profile.image_profil && typeof profile.image_profil === "string") {
          setPhotoUrl(profile.image_profil);
        }
      }
    } catch (err) {
      console.error("Gagal membaca user data dari localStorage", err);
    }
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleSignOut = () => {
    LocalStorageService.clear();
    closeDropdown();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={photoUrl}
            alt="Preview"
            onError={(e) => {
              const fallback = "/images/default.jpg";
              if (e.currentTarget.src !== fallback) {
                setPhotoUrl(fallback);
              }
            }}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="block mr-1 font-medium text-theme-sm dark:text-white">
          {user?.nama || "Pengguna"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-64 rounded-2xl border bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="flex flex-col gap-1 border-b pb-3 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={() => {
                closeDropdown();
                navigate("/profile");
              }}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <span>Edit Profile</span>
            </DropdownItem>
          </li>
        </ul>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <span>Sign Out</span>
        </button>
      </Dropdown>
    </div>
  );
}
