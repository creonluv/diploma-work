import { useEffect, useState } from "react";
import { getSearchWith } from "../../utils/getSearchParams";
import "./FiltersGigs.scss";
import { useNavigate } from "react-router-dom";

export const FilterGigs: React.FC = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    cat: string;
    sort: string;
    min: string;
    max: string;
    page: string;
  }>({
    cat: "",
    sort: "",
    min: "",
    max: "",
    page: "1",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      cat: params.get("cat") || "",
      sort: params.get("sort") || "",
      min: params.get("min") || "",
      max: params.get("max") || "",
      page: params.toString(),
    };

    setFilters(newFilters);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filteredFilters = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    const queryString = getSearchWith(filteredFilters, "");
    navigate(`?${queryString}`);
  };

  const handleResetFilters = () => {
    setFilters({
      cat: "",
      sort: "",
      min: "",
      max: "",
      page: "1",
    });
  };

  return (
    <div className="filterGigs">
      <div className="filterGigs__body">
        <select
          name="cat"
          className="form__input input"
          value={filters.cat}
          onChange={handleInputChange}
        >
          <option value="">Choose a category</option>
          <option value="design">Design</option>
          <option value="js">JavaScript</option>
          <option value="Web Development">Web Development</option>
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
          name="min"
          className="form__input input"
          value={filters.min}
          placeholder="Min"
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="max"
          className="form__input input"
          value={filters.max}
          placeholder="Max"
          onChange={handleInputChange}
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

        <div className="filterGigs__buttons">
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
    </div>
  );
};
