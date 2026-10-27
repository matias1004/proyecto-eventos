import { toUserDTO } from "./user.dto.js";

export const toTicketDTO = (ticket) => {
  if (!ticket) return null;
  const plain = typeof ticket.toObject === "function" ? ticket.toObject() : ticket;

  // Si el ticket viene con populate del usuario, lo filtramos con el mismo DTO
  if (plain.user && typeof plain.user === "object" && plain.user.email) {
    plain.user = toUserDTO(plain.user);
  }

  return plain;
};