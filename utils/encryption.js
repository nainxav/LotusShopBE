import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

function encrypt(text) {
  if (typeof text !== 'string') {
    throw new TypeError("The 'text' argument must be a string");
  }
  const cipher = crypto.createCipheriv(algorithm, crypto.scryptSync(secretKey, 'salt', 32), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export default encrypt;
