import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "currentUser";

export const register = (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ status: "error", message: info?.message || "No se pudo registrar el usuario" });
    }
    return res.status(201).json({ status: "success", payload: user });
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: "error", message: info?.message || "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    });

    return res.status(200).json({
      status: "success",
      message: "Sesión iniciada",
      payload: { id: user._id, email: user.email, role: user.role },
    });
  })(req, res, next);
};

export const current = (req, res) => {
  res.status(200).json({ status: "success", payload: req.user });
};

export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ status: "success", message: "Sesión cerrada" });
};