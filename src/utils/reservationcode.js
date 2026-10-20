import crypto from "crypto";

export const generateReservationCode = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TCK-${random}`;
};