import crypto from "crypto";

import Contract from "../models/contract.model";
import User from "../models/user.model";

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
        .json({ message: "Only sellers can create contracts" });
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

    res.status(201).json({
      message: "Contract created successfully",
      contract: newContract,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating contract", error: error.message });
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

    const digitalSignature = sign.sign(user.privateKey, "base64");

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

    res.status(200).json({ message: "Contract signed successfully", contract });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error signing contract", error: error.message });
  }
};
