import React, { useState } from "react";
import { Gig } from "../../types/Gig";
import "./GigUserCard.scss";
import nophoto from "../../assets/img/no-image-icon.png";
import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import { updateGig } from "../../api/gigs";

interface GigCardProps {
  gig: Gig;
}

export const GigUserCard: React.FC<GigCardProps> = ({ gig }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedGig, setUpdatedGig] = useState<Gig>(gig);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUpdatedGig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updated = await updateGig(gig._id, updatedGig);

    console.log(updated);

    setUpdatedGig(updated);
  };

  return (
    <div className="gigusercard">
      <div className="gigusercard__body">
        <img
          className="gigusercard__coverImg"
          src={gig.cover ? `http://localhost:8800/api/${gig.cover}` : nophoto}
          alt={gig.shortTitle}
        />

        <div className="gigusercard__main">
          <div className="gigusercard__info">
            <div className="gigusercard__information">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={updatedGig.title}
                  onChange={handleChange}
                  className="gigusercard__editInput"
                />
              ) : (
                <h4 className="text-bold">{gig.title}</h4>
              )}

              {isEditing ? (
                <textarea
                  name="desc"
                  value={updatedGig.desc}
                  onChange={handleChange}
                  className="gigusercard__editTextarea"
                />
              ) : (
                <p>{gig.desc}</p>
              )}
            </div>

            <div className="gigusercard__bottom">
              <div className="gigusercard__price text-bold">
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={updatedGig.price}
                    onChange={handleChange}
                    className="gigusercard__editInput"
                  />
                ) : (
                  `$${gig.price}`
                )}
              </div>

              <div className="gigusercard__rating">
                <img src={shiny} alt="" />
                <p className="text-light">{gig.rating}</p>
              </div>
            </div>
          </div>

          <div className="gigusercard__actions">
            {isEditing ? (
              <div className="gigusercard__button">
                <button
                  onClick={() => setIsEditing(false)}
                  className="button button_lg button__transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="button button_lg button_default button_full-size"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="gigusercard__button">
                <button
                  onClick={() => setIsEditing(true)}
                  className="button button_lg button__transparent"
                >
                  Edit
                </button>
                <button
                  // onClick={() => onDelete(gig._id)}
                  className="button button_lg button_default button_full-size"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
