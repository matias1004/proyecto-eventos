import * as ticketsService from "../services/tickets.service.js";

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketsService.createTicket(req.params.id, req.body, req.user);
    res.status(201).json({ status: "success", payload: ticket });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getMyTickets(req.user._id);
    res.status(200).json({ status: "success", payload: tickets });
  } catch (error) {
    next(error);
  }
};

export const getEventTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getEventTickets(req.params.id, req.user);
    res.status(200).json({ status: "success", payload: tickets });
  } catch (error) {
    next(error);
  }
};

export const cancelTicket = async (req, res, next) => {
  try {
    const ticket = await ticketsService.cancelTicket(req.params.id, req.user);
    res.status(200).json({ status: "success", payload: ticket });
  } catch (error) {
    next(error);
  }
};