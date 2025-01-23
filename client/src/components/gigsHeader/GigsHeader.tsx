import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Gig } from "../../types/Gig";
import "./GigsHeader.scss";

type Props = {
  gigs: Gig[] | null;
  category?: string;
};

export const GigsHeader: React.FC<Props> = ({ gigs, category }) => {
  const navigate = useNavigate();

  const [sortField, setSortField] = useState<string>(() => {
    const sort = new URLSearchParams(window.location.search).get("sort");

    return sort || "price";
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const cat = new URLSearchParams(window.location.search).get("cat");

    return cat || "design";
  });

  const [minPrice, setMinPrice] = useState<number | "">(() => {
    const min = new URLSearchParams(window.location.search).get("min");

    return min ? Number(min) : 0;
  });

  const [maxPrice, setMaxPrice] = useState<number | "">(() => {
    const max = new URLSearchParams(window.location.search).get("max");

    return max ? Number(max) : 1000;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (sortField) {
      urlParams.set("sort", sortField);
    }

    if (selectedCategory) {
      urlParams.set("cat", selectedCategory);
    }

    if (minPrice !== "") {
      urlParams.set("min", String(minPrice));
    }

    if (maxPrice !== "") {
      urlParams.set("max", String(maxPrice));
    }

    navigate(`?${urlParams.toString()}`);
  }, [sortField, selectedCategory, minPrice, maxPrice, navigate]);

  return (
    <>
      <div className="catalogHeader">
        <div className="catalogHeader__top">
          <h2 className="catalogHeader__title">{category}</h2>
          <p className="catalogHeader__info">{`${gigs?.length || 0} models`}</p>
        </div>

        <div className="catalogHeader__filters">
          <div className="catalogHeader__left">
            <div className="catalogHeader__filter price">
              <span className="catalogHeader__filterText">Price Range</span>
              <input
                type="number"
                value={minPrice}
                placeholder="Min"
                onChange={(e) =>
                  setMinPrice(e.target.value ? Number(e.target.value) : "")
                }
              />
              <input
                type="number"
                value={maxPrice}
                placeholder="Max"
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>
          </div>

          <div className="catalogHeader__right">
            <div className="catalogHeader__filter">
              <span className="catalogHeader__filterText">Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="design">Design</option>
                <option value="JS">JavaScript</option>
              </select>
            </div>
            <div className="catalogHeader__filter">
              <span className="catalogHeader__filterText">Sort by</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="createdAt">Creation Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
