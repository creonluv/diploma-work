import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { z } from "zod";
import "./AddJobPage.scss";
import { getAllSkills } from "../../api/skills";
import { Skill } from "../../types/Skill";
import Modal from "react-modal";
import { createJobAsync } from "../../features/job";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  shortTitle: z.string(),
  shortDesc: z.string(),
  budget: z.number().min(1, "Budget is required").int(),
  deadline: z.string().min(1, "Deadline is required"),
  cat: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof formSchema>;

export const AddJobPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    shortTitle: "",
    shortDesc: "",
    budget: 0,
    deadline: "",
    cat: "",
  });
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      shortTitle: "",
      shortDesc: "",
      cat: "",
      budget: 0,
      deadline: "",
    });
    setSelectedSkills([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "budget" ? (value === "" ? "" : Number(value)) : value;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      formSchema.parse(formData);

      setErrors({});

      const formattedTags = selectedSkills.map((tag) => tag._id);

      await dispatch(
        createJobAsync({
          ...formData,
          tags: formattedTags,
        })
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};

        err.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });

        setErrors(newErrors);
      }
    }
  };

  return (
    <section className="addjob">
      <div className="addjob__container">
        <form className="addjob__form form" onSubmit={handleSubmit}>
          <div className="addjob__form-section">
            <div className="addjob__background">
              <div className="addjob__top">
                <h2 className="addjob__title">Create a Job</h2>
                <p className="addjob__info">
                  Please fill out the form below to create a new job listing,
                  providing a title, description, budget, deadline, category,
                  and required skills.
                </p>
              </div>
            </div>

            <div className="addjob__form-section-top">
              <div className="addjob__background">
                <h4 className="text-bold">Job Title & Description</h4>
                <div className="group">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form__input input"
                    placeholder="Enter title"
                    onChange={handleInputChange}
                    value={formData.title}
                  />
                  {errors.title && (
                    <span className="error">{errors.title}</span>
                  )}

                  <textarea
                    id="description"
                    name="description"
                    className="form__input input"
                    placeholder="Enter description"
                    onChange={handleInputChange}
                    value={formData.description}
                  ></textarea>
                  {errors.description && (
                    <span className="error">{errors.description}</span>
                  )}
                  <input
                    id="shortTitle"
                    name="shortTitle"
                    type="text"
                    className="form__input input"
                    placeholder="Enter short title"
                    onChange={handleInputChange}
                    value={formData.shortTitle}
                  />
                  <textarea
                    id="shortDesc"
                    name="shortDesc"
                    className="form__input input"
                    placeholder="Enter short description"
                    onChange={handleInputChange}
                    value={formData.shortDesc}
                  ></textarea>
                </div>
              </div>

              <div className="addjob__right">
                <div className="addjob__background">
                  <h4 className="text-bold">Category & Skill</h4>
                  <div className="group">
                    <select
                      onChange={handleInputChange}
                      value={formData.cat}
                      id="cat"
                      name="cat"
                      className="form__input input"
                    >
                      <option value="">Choose a category</option>
                      <option value="design">Design</option>
                      <option value="js">JavaScript</option>
                      <option value="webdev">Web Development</option>
                      <option value="frontend">Front-End Development</option>
                      <option value="backend">Back-End Development</option>
                      <option value="fullstack">Full-Stack Development</option>
                      <option value="uiux">UI/UX Design</option>
                      <option value="mobile">Mobile Development</option>
                      <option value="devops">DevOps</option>
                      <option value="ml">Machine Learning</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="datascience">Data Science</option>
                      <option value="gamedev">Game Development</option>
                      <option value="seo">SEO & Digital Marketing</option>
                    </select>
                    {errors.cat && <span className="error">{errors.cat}</span>}

                    <div className="profile__group tags">
                      {selectedSkills.length > 0 ? (
                        <div className="profile__skills-list">
                          {selectedSkills.map((skill) => (
                            <div key={skill._id} className="skill-item">
                              <span>{skill.name}</span>
                              <button
                                type="button"
                                className="remove-skill-button"
                                onClick={() => {
                                  setSelectedSkills((prevSelected) =>
                                    prevSelected.filter(
                                      (s) => s._id !== skill._id
                                    )
                                  );
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No tags added</p>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="add-skill-button"
                      >
                        Add New Tag
                      </button>
                    </div>
                  </div>
                </div>

                <div className="addjob__background">
                  <h4 className="text-bold">Budget & Deadline</h4>
                  <div className="group">
                    <input
                      id="budget"
                      name="budget"
                      className="form__input input"
                      type="number"
                      placeholder="Enter budget"
                      onChange={handleInputChange}
                      value={formData.budget}
                    />
                    {errors.budget && (
                      <span className="error">{errors.budget}</span>
                    )}

                    <input
                      type="date"
                      className="form__input input"
                      name="deadline"
                      onChange={handleInputChange}
                      value={formData.deadline}
                    />
                    {errors.deadline && (
                      <span className="error">{errors.deadline}</span>
                    )}

                    <div className="profile__buttons">
                      <div className="profile__button button-wrapper">
                        <button
                          className="button button_lg button__transparent"
                          type="reset"
                          onClick={handleCancel}
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                      <div className="profile__button button-wrapper">
                        <button
                          className="button button_lg button_default button_full-size"
                          type="submit"
                        >
                          <span>Create</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
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
            width: "256px",
            height: "256px",
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
                  checked={selectedSkills.some(
                    (selected) => selected._id === skill._id
                  )}
                  onChange={() => {
                    setSelectedSkills((prevSelected) =>
                      prevSelected.some((s) => s._id === skill._id)
                        ? prevSelected.filter((s) => s._id !== skill._id)
                        : [...prevSelected, skill]
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
        </div>
      </Modal>
    </section>
  );
};
