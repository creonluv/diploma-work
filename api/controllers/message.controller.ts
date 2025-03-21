import mongoose from "mongoose";
import Message from "../models/message.model";
import Conversation from "../models/conversation.model";

export const createMessage = async (req, res, next) => {
  const { conversationId, desc } = req.body;

  if (
    !conversationId ||
    !mongoose.Types.ObjectId.isValid(conversationId) ||
    conversationId.length !== 24
  ) {
    return res.status(400).send({ message: "Invalid conversationId" });
  }

  const newMessage = new Message({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    userId: req.userId,
    desc,
  });

  try {
    const savedMessage = await newMessage.save();

    await Conversation.findOneAndUpdate(
      { _id: conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: savedMessage._id,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    }).populate({
      path: "userId",
      select: "username profileImage",
    });

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};

export const markMessagesAsRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.id,
        isRead: false,
        userId: { $ne: req.userId },
      },
      { $set: { isRead: true } }
    );

    res.status(200).send({ message: "Messages marked as read" });
  } catch (err) {
    next(err);
  }
};
