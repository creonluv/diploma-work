import { useEffect, useState } from "react";
import { getSearchWith } from "../../utils/getSearchParams";
import { Skill } from "../../types/Skill";
import { getAllSkills } from "../../api/skills";
import Modal from "react-modal";
import "./FiltersJobs.scss";
import { useNavigate } from "react-router-dom";

export const FilterJobs: React.FC = () => {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    search: string;
    cat: string;
    tags: string[];
    minBids: string;
    sort: string;
    page: string;
  }>({
    search: "",
    cat: "",
    tags: [],
    minBids: "",
    sort: "",
    page: "1",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      search: params.get("search") || "",
      cat: params.get("cat") || "",
      tags: params.getAll("tags"),
      minBids: params.get("minBids") || "",
      sort: params.get("sort") || "",
      page: params.get("page") || "1",
    };

    setFilters(newFilters);
    setSelectedSkills(
      allSkills.filter((skill) => newFilters.tags.includes(skill._id))
    );
  }, [location.search, allSkills]);

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

  useEffect(() => {
    if (allSkills.length > 0) {
      applyFilters();
    }
  }, [allSkills]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChangeInModal = (skill: Skill) => {
    setSelectedSkills((prevSelected) => {
      const updatedSelected = prevSelected.some((s) => s._id === skill._id)
        ? prevSelected.filter((s) => s._id !== skill._id)
        : [...prevSelected, skill];

      setFilters((prevFilters) => ({
        ...prevFilters,
        tags: updatedSelected.map((selected) => selected._id),
      }));

      return updatedSelected;
    });
  };

  const applyFilters = () => {
    const filteredFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    const queryString = getSearchWith(filteredFilters, "");
    // setSearchParams(queryString);
    navigate(`?${queryString}`);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      cat: "",
      tags: [],
      minBids: "",
      sort: "",
      page: "1",
    });
  };

  return (
    <div className="filterJobs">
      <div className="filterJobs__body">
        <input
          type="text"
          name="search"
          className="form__input input"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Search..."
        />

        <select
          name="cat"
          className="form__input input"
          value={filters.cat}
          onChange={handleInputChange}
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

        <input
          type="number"
          name="minBids"
          value={filters.minBids}
          className="form__input input"
          onChange={handleInputChange}
          placeholder="Min Bids"
        />

        <select
          name="sort"
          value={filters.sort}
          className="form__input input"
          onChange={handleInputChange}
        >
          <option value="">Sort by</option>
          <option value="budget">Budget</option>
          <option value="date">Date</option>
        </select>

        <div className="profile__group tags">
          {selectedSkills.length > 0 ? (
            <div className="profile__skills-list">
              {selectedSkills.map((skill) => (
                <div key={skill._id} className="skill-item">
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    className="remove-skill-button"
                    onClick={() => handleTagsChangeInModal(skill)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No tags choosed</p>
          )}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="add-skill-button"
          >
            +
          </button>
        </div>

        <div className="filterJobs__buttons">
          <button
            className="button button_lg button_default button_full-size"
            onClick={applyFilters}
          >
            Apply
          </button>
          <button
            className="button button_lg button__transparent"
            onClick={handleResetFilters}
          >
            Cancel
          </button>
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
                  onChange={() => handleTagsChangeInModal(skill)}
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
    </div>
  );
};
