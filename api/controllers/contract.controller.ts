import crypto from "crypto";
import nodemailer from "nodemailer";

import Contract from "../models/contract.model";
import User from "../models/user.model";
import { decryptPrivateKey } from "../utils/encryptPrivateKey";
import bidModel from "../models/bid.model";

export const createContract = async (req, res) => {
  try {
    const {
      jobId,
      freelancerId,
      employerId,
      bidId,
      totalAmount,
      agreedDeadline,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user || !user.isSeller) {
      return res
        .status(403)
        .json({ message: "Only sellers can creat contracts" });
    }

    await bidModel.updateMany(
      { jobId, _id: { $ne: bidId } },
      { status: "rejected" }
    );

    const selectedBid = await bidModel.findByIdAndUpdate(
      bidId,
      { status: "accepted" },
      { new: true }
    );

    if (!selectedBid) {
      return res.status(400).json({ message: "Selected bid not found" });
    }

    const newContract = new Contract({
      jobId,
      freelancerId,
      employerId,
      bidId,
      totalAmount,
      agreedDeadline,
    });

    await newContract.save();

    const freelancer = await User.findById(freelancerId);
    if (!freelancer || !freelancer.email) {
      return res
        .status(400)
        .json({ message: "Freelancer not found or email ming" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: freelancer.email,
      subject: "You have been selected for a contract!",
      text: `
        Hello ${freelancer.username},
        
        Congratulations! You have been selected for the contract related to job #${jobId}.
        
        Details:
        - Job ID: ${jobId}
        - Total Amount: ${totalAmount}
        - Agreed Deadline: ${agreedDeadline}
        
        Please review the contract and confirm.
        
        Best regards,
        Your team
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Contract created successfully",
      contract: newContract,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error creating contract", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Unknown error occurred", error: "Unknown error" });
    }
  }
};

export const signContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { contractText, role, userId } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(contractText);
    sign.end();

    const digitalSignature = sign.sign(
      decryptPrivateKey(user.encryptedPrivateKey),
      "base64"
    );

    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(contractText);
    verifier.end();

    const publicKey = user.publicKey;
    const isValid = verifier.verify(
      publicKey,
      Buffer.from(digitalSignature, "base64")
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    if (role === "freelancer") {
      contract.freelancerSignature = digitalSignature;
    } else if (role === "employer") {
      contract.employerSignature = digitalSignature;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (contract.freelancerSignature && contract.employerSignature) {
      contract.status = "signed";
    }

    await contract.save();

    res.status(200).json({ message: "Contact signed successfully", contract });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error signing contract", error: error.message });
  }
};

export const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    res
      .status(200)
      .json({ message: "Contracts fetched successfully", contracts });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching contracts", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Unknown error occurred", error: "Unknown error" });
    }
  }
};

export const getContractById = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await Contract.findById(contractId)
      .populate("jobId")
      .populate("freelancerId")
      .populate("employerId");

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res
      .status(200)
      .json({ message: "Contract fetched successfully", contract });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching contract", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Unknown error occurred", error: "Unknown error" });
    }
  }
};
