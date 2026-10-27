export const toEventDTO = (event) => {
  if (!event) return null;
  return typeof event.toObject === "function" ? event.toObject() : event;
};