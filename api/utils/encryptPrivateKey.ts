import crypto from "crypto";

export const encryptPrivateKey = (privateKey: string) => {
  const encryptionKey = process.env.ENCRYPTION_KEY as string;
  console.log(encryptionKey);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

export const decryptPrivateKey = (encryptedPrivateKey: string) => {
  const encryptionKey = process.env.ENCRYPTION_KEY as string;
  const [ivHex, encrypted] = encryptedPrivateKey.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
