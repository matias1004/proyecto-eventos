export const toUserDTO = (user) => {
  if (!user) return null;
  const plain = typeof user.toObject === "function" ? user.toObject() : user;
  const { password, __v, ...safeUser } = plain;
  return safeUser;
};