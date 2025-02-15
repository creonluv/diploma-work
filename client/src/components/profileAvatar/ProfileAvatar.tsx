import React, { useState } from "react";
import { updateProfile, updateProfileImage } from "../../api/profile";
import { Loader } from "../loader";

interface ProfileAvatarProps {
  initialImage?: string;
  userId: string | null;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  initialImage,
  userId,
}) => {
  const [avatar, setAvatar] = useState<string>(
    initialImage || "/default-avatar.png"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          setAvatar(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profileImage", file);

      formData.forEach((value, key) => {
        console.log(`hui`);
        console.log(`${key}:`, value);
      });

      try {
        if (!userId) {
          console.error("User ID is required to upload the image");
          return;
        }

        setLoading(true);
        const response = await updateProfileImage(userId, formData);

        console.log("Response from server:", response);

        if (response.profileImage) {
          setAvatar(`http://localhost:8800/api${response.profileImage}`);
        } else {
          console.error("profileImage не знайдено у відповіді сервера");
        }
      } catch (error) {
        console.error("Помилка завантаження зображення:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
        <img
          src={avatar}
          alt="Profile Avatar"
          style={{
            width: "128px",
            height: "128px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #edeef0",
            opacity: loading ? 0.5 : 1,
          }}
        />
        {loading && <Loader />}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileAvatar;
