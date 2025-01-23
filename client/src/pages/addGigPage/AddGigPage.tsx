import { useAppDispatch } from "../../app/hooks";
import { useState, useCallback } from "react";
import { Gig, GigInput } from "../../types/Gig";
import { createGigAsync } from "../../features/gig";
import { z } from "zod";

import "./AddGigPage.scss";
import { PayloadAction } from "@reduxjs/toolkit";
import { addPhotosToGig } from "../../api/gigs";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().optional(),
  shortTitle: z.string().optional(),
  shortDesc: z.string().optional(),
  cat: z.string().min(1, "Category is required"),
  price: z.number().min(1, "Price is required"),
  deliveryTime: z.number().min(1, "Delivery time is required"),
  features: z.string().min(1, "Features are required"),
});

type FormData = z.infer<typeof formSchema>;

export const AddGigPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const storedUserId = localStorage.getItem("userId");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    desc: "",
    shortTitle: "",
    shortDesc: "",
    cat: "",
    price: 0,
    deliveryTime: 0,
    features: "",
  });

  const [created, setCreated] = useState(false);
  const [idOfGig, setIdOfGig] = useState("");
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "price" || name === "deliveryTime"
        ? value === ""
          ? ""
          : Number(value)
        : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      desc: "",
      shortTitle: "",
      shortDesc: "",
      cat: "",
      price: 0,
      deliveryTime: 0,
      features: "",
    });
  };

  const handleCreateGig = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        formSchema.parse(formData);
      } catch (err) {
        if (err instanceof z.ZodError) {
          const newErrors: { [key: string]: string } = {};

          err.errors.forEach((error) => {
            newErrors[error.path[0]] = error.message;
          });

          setErrors(newErrors);
        }
        return;
      }

      const data: GigInput = {
        title: formData.title,
        desc: formData.desc,
        shortTitle: formData.shortTitle,
        shortDesc: formData.shortDesc,
        cat: formData.cat,
        price: Number(formData.price),
        deliveryTime: Number(formData.deliveryTime),
        userId: storedUserId,
        features: formData.features.split(","),
      };

      setCreated(true);

      const response = (await dispatch(
        createGigAsync(data)
      )) as PayloadAction<Gig>;
      if (response?.payload) {
        const gigId = response.payload._id;

        setIdOfGig(gigId);
      }
    },
    [dispatch, storedUserId, formData]
  );

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedCoverFile(file);
    }
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedImageFiles(Array.from(files));
    }
  };

  const handleAddPhotosToGig = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCoverFile || selectedImageFiles.length === 0) {
      alert("Please select a cover and at least one image.");
      return;
    }

    console.log(selectedCoverFile);
    console.log(selectedImageFiles);

    const formData = new FormData();
    formData.append("cover", selectedCoverFile);
    selectedImageFiles.forEach((file) => formData.append("images", file));

    console.log("Cover file:", formData.get("cover"));
    console.log("Image files:", formData.getAll("images"));

    try {
      const updatedGig = await addPhotosToGig(idOfGig, formData);
      console.log(updatedGig);
    } catch (error) {
      console.error("Error uploading photos", error);
    }
  };

  return (
    <section className="addgig">
      <div className="addgig__container">
        <div className="addgig__body">
          {created ? (
            <form className="addgig__form form" onSubmit={handleAddPhotosToGig}>
              <div className="addgig__form-section">
                <div className="addgig__top">
                  <h2 className="addgig__title">Adding photos to a gig</h2>
                  <p className="addgig__info">
                    Learn how to upload and manage photos for a gig, from
                    selecting images to processing uploads efficiently.
                  </p>
                </div>

                <label htmlFor="cover" className="addgig__label">
                  Choose cover image
                </label>
                <input
                  type="file"
                  id="cover"
                  className="form__input input"
                  onChange={handleCoverFileChange}
                />

                <label htmlFor="images" className="addgig__label">
                  Choose additional images (optional)
                </label>
                <input
                  type="file"
                  id="images"
                  className="form__input input"
                  multiple
                  onChange={handleImageFilesChange}
                />
              </div>

              <div className="profile__buttons">
                <div className="profile__button button-wrapper">
                  <button
                    className="button button_lg button_default button_full-size"
                    type="submit"
                  >
                    <span>Next step</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form className="addgig__form form" onSubmit={handleCreateGig}>
              <div className="addgig__form-section">
                <div className="addgig__top">
                  <h2 className="addgig__title">Creating a new gig</h2>
                  <p className="addgig__info">
                    Create and list your gig quickly by filling out the details
                    and setting your price.
                  </p>
                </div>

                <div className="addgig__group">
                  <div className="group">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="form__input input"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title"
                    />
                    {errors.title && (
                      <span className="error">{errors.title}</span>
                    )}

                    <textarea
                      id="desc"
                      name="desc"
                      className="form__input input"
                      value={formData.desc ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter description"
                    ></textarea>

                    <input
                      id="shortTitle"
                      name="shortTitle"
                      type="text"
                      className="form__input input"
                      value={formData.shortTitle}
                      onChange={handleInputChange}
                      placeholder="Enter short title"
                    />

                    <textarea
                      id="shortDesc"
                      name="shortDesc"
                      className="form__input input"
                      value={formData.shortDesc}
                      onChange={handleInputChange}
                      placeholder="Enter short description"
                    ></textarea>

                    <select
                      id="cat"
                      name="cat"
                      className="form__input input"
                      value={formData.cat}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose a category</option>
                      <option value="design">Design</option>
                      <option value="JS">JS</option>
                      <option value="webdev">Web Development</option>
                    </select>
                    {errors.cat && <span className="error">{errors.cat}</span>}

                    <input
                      id="price"
                      name="price"
                      className="form__input input"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <span className="error">{errors.price}</span>
                    )}

                    <input
                      id="deliveryTime"
                      name="deliveryTime"
                      className="form__input input"
                      type="number"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      placeholder="Enter delivery time (days)"
                    />
                    {errors.deliveryTime && (
                      <span className="error">{errors.deliveryTime}</span>
                    )}

                    <input
                      id="features"
                      name="features"
                      className="form__input input"
                      type="text"
                      value={formData.features}
                      onChange={handleInputChange}
                      placeholder="Enter features (comma separated)"
                    />
                    {errors.features && (
                      <span className="error">{errors.features}</span>
                    )}
                  </div>
                </div>
              </div>

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
                    <span>Next step</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
