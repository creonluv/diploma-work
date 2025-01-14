import Tag from "../models/tag.model";

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const existingTag = await Tag.findOne({ name });

    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists." });
    }

    const newTag = new Tag({ name });

    await newTag.save();

    res.status(201).json(newTag);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create tag.", error: error.message });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    res.status(200).json(tags);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch tags.", error: error.message });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found." });
    }

    res.status(200).json(tag);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch tag.", error: error.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found." });
    }

    res.status(200).json(updatedTag);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update tag.", error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found." });
    }

    res.status(200).json({ message: "Tag deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete tag.", error: error.message });
  }
};
