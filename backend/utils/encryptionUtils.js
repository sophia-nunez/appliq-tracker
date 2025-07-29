const crypto = require("crypto");
require("dotenv").config();

// get key using env variables with secret and salt
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
const SALT = process.env.SALT;
const key = crypto.scryptSync(ENCRYPTION_SECRET, SALT, 32);

// reference / starter code from https://www.w3schools.com/nodejs/nodejs_crypto.asp
// Encrypt data
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  // encrypt the data
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // return encrypted data and IV
  return `${iv.toString("hex")}:${encrypted}`;
}

// Decrypt data
function decrypt(data) {
  // get iv and ecrypted data from string
  const [iv, encryptedData] = data.split(":");

  // made decipher using the vars
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );

  // decrypt the data using decipher
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
