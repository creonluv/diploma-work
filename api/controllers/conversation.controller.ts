import Conversation from "../models/conversation.model";
import createError from "../utils/createError";

export const createConversation = async (req, res, next) => {
  console.log("req: " + req.isSeller);
  const sellerId = req.isSeller ? req.userId : req.body.to;
  const buyerId = req.isSeller ? req.body.to : req.userId;

  try {
    const existingConversation = await Conversation.findOne({
      sellerId,
      buyerId,
    });

    if (existingConversation) {
      return res.status(200).send(existingConversation);
    }

    const newConversation = new Conversation({
      sellerId,
      buyerId,
      readBySeller: req.isSeller,
      readByBuyer: !req.isSeller,
    });

    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("lastMessage", "desc")
      .populate("sellerId", "name email")
      .populate("buyerId", "name email");

    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id })
      .populate("sellerId", "name email")
      .populate("buyerId", "name email");

    if (!conversation) {
      return next(createError(404, "Not found!"));
    }

    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  console.log(req.isSeller);

  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    )
      .populate("sellerId", "name email")
      .populate("buyerId", "name email");

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};
