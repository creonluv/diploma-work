import ProfileAvatar from "../../components/profileAvatar/ProfileAvatar";
import "./ProfilePage.scss";
import Modal from "react-modal";

import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import { useEffect, useState } from "react";
import { Profile } from "../../types/Profile";
import {
  addSkillToProfile,
  getProfile,
  removeSkillFromProfile,
  updateProfile,
} from "../../api/profile";
import { getAllSkills } from "../../api/skills";
import { Skill } from "../../types/Skill";
import { Loader } from "../../components/loader";

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | undefined>();
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    description: "",
  });

  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUserId) {
        console.warn("User ID is not available in localStorage.");
        return;
      }

      try {
        const profile: Profile = await getProfile(storedUserId);
        setProfile(profile);

        setFormData({
          username: profile.userId.username,
          email: profile.userId.email,
          phone: profile.userId.phone,
          location: profile.location,
          description: profile.description || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchProfile();
  }, [storedUserId]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await getAllSkills();
        setAllSkills(skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkills = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select skills to add.");
      return;
    }

    if (!storedUserId) {
      console.warn("User ID is not available in localStorage.");
      return;
    }

    try {
      setIsLoading(true);

      await addSkillToProfile(storedUserId, {
        skillIds: selectedSkills,
      });

      const updatedProfile = await getProfile(storedUserId);
      setProfile(updatedProfile);

      setSelectedSkills([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!storedUserId || !profile || !profile.freelancerDetails) {
      console.warn("User ID or profile is not available.");
      return;
    }

    try {
      setIsLoading(true);

      if (!profile.freelancerDetails.skills) {
        console.warn("No skills found.");
        return;
      }

      const updatedSkills = profile.freelancerDetails.skills.filter(
        (skill) => skill._id !== skillId
      );

      await removeSkillFromProfile(storedUserId, { skillId });

      setProfile({
        ...profile,
        freelancerDetails: {
          ...profile.freelancerDetails,
          skills: updatedSkills,
        },
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    if (profile) {
      setFormData({
        username: profile.userId.username,
        email: profile.userId.email,
        phone: profile.userId.phone,
        location: profile.location,
        description: profile.description || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!storedUserId) {
        console.warn("User ID is not available in localStorage.");
        return;
      }

      console.log(formData);

      await updateProfile(storedUserId, formData);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(profile?.profileImage);

  return (
    <section className="profile">
      <div className="profile__container">
        <div className="profile__body">
          <div className="profile__top">
            {profile?.profileImage ? (
              <ProfileAvatar
                initialImage={`http://localhost:8800/api${profile?.profileImage}`}
                userId={storedUserId}
              />
            ) : (
              <div>Loading...</div>
            )}

            <div className="profile__fullname">
              <img className="profile__shiny" src={shiny} alt="menu" />

              <div className="profile__name-desc">
                <div className="profile__name_top">
                  <p className="text-bold">{profile?.userId.username}</p>
                  <p className="text-muted">{profile?.userRating}</p>
                </div>

                <p className="text-muted">{profile?.profileType}</p>
              </div>
            </div>
          </div>

          <form className="profile__form form" onSubmit={handleSubmit}>
            <div className="profile__form-section">
              <div className="profile__form-title">
                <h4 className="text-bold">Personal information</h4>
              </div>
              <div className="profile__group">
                <div className="group">
                  <input
                    type="text"
                    className="form__input input"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    className="form__input input"
                    placeholder={"E-mail"}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="group">
                  <input
                    type="phone"
                    className="form__input input"
                    placeholder="Phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    className="form__input input"
                    placeholder={"City"}
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="profile__buttons">
              <div className="profile__button button-wrapper">
                <button
                  className="button button_lg button__transparent"
                  type="reset"
                  onClick={handleResetForm}
                >
                  <span>Cancel</span>
                </button>
              </div>
              <div className="profile__button button-wrapper">
                <button
                  className="button button_lg button_default button_full-size"
                  type="submit"
                >
                  <span>Save</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="profile__body">
          <div className="profile__form-section">
            <div className="profile__form-title">
              <h4 className="text-bold">
                {profile?.profileType === "freelancer"
                  ? "Skills & Portfolio"
                  : "Employer Details"}
              </h4>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="profile__group">
                {profile?.profileType === "freelancer" &&
                profile.freelancerDetails?.skills?.length ? (
                  <div className="profile__skills-list">
                    {profile.freelancerDetails.skills.map((skill) => (
                      <div key={skill._id} className="skill-item">
                        <span>{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill._id)}
                          className="remove-skill-button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No skills added</p>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="add-skill-button"
                >
                  Add New Skill
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile__body">
          <div className="profile__form-section">
            <div className="profile__form-title">
              <h4 className="text-bold">Other</h4>
            </div>
            <div className="profile__group">{profile?.description}</div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
          content: {
            color: "black",
            margin: "auto",
            padding: "24px",
            width: "376px",
            height: "376px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "16px",
            overflowY: "auto",
            overflow: "hidden",
          },
        }}
      >
        <h4>Select Skills</h4>
        <div>
          <ul>
            {allSkills.map((skill) => (
              <li className="checkbox" key={skill._id}>
                <input
                  type="checkbox"
                  className="checkbox__index"
                  checked={selectedSkills.includes(skill._id)}
                  onChange={() => {
                    setSelectedSkills((prevSelected) =>
                      prevSelected.includes(skill._id)
                        ? prevSelected.filter((id) => id !== skill._id)
                        : [...prevSelected, skill._id]
                    );
                  }}
                />
                <label className="checkbox__label">{skill.name}</label>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="button button_sm button_transparent"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSkills}
            className="button button_sm button_default"
          >
            Add Selected Skills
          </button>
        </div>
      </Modal>
    </section>
  );
};
