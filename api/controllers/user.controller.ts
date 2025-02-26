import User from "../models/user.model";
import createError from "../utils/createError";

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account!"));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).send("User deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-publicKey -encryptedPrivateKey"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    next(createError(500, "Could not fetch user!"));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-publicKey -encryptedPrivateKey");

    res.status(200).send(users);
  } catch (err) {
    next(createError(500, "Could not fetch users!"));
  }
};
