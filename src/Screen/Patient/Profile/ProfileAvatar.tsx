import React, { useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";

interface Props {
  firstName: string;
  lastName: string;
}

const ProfileAvatar: React.FC<Props> = ({ firstName, lastName }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const initials =
    firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div
        className="relative w-28 h-28 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-semibold cursor-pointer overflow-hidden"
        onClick={() => inputRef.current?.click()}
      >
        {image ? (
          <img src={image} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />

      <button
        type="button"
        className="mt-4 px-6 py-2 border border-blue-500 text-blue-600 rounded-md  hover:bg-blue-100 transition flex items-left gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <FaEdit className="text-xl"/> Edit profile
      </button>
    </div>
  );
};

export default ProfileAvatar;
