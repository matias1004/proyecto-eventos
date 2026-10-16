import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { registerUser } from "../services/users.service.js";
import * as usersDao from "../dao/users.dao.js";
import { comparePassword } from "../utils/hash.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "currentUser";

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies[COOKIE_NAME] || null;
  }
  return null;
};

export const initPassport = () => {
  // Estrategia de registro: valida, hashea y crea el usuario
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await registerUser(req.body);
          return done(null, user);
        } catch (error) {
          return done(null, false, { message: error.message });
        }
      }
    )
  );

  // Estrategia de login: verifica email + contraseña
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const normalizedEmail = email?.trim().toLowerCase();
          const user = await usersDao.findByEmail(normalizedEmail);

          if (!user) return done(null, false, { message: "Credenciales inválidas" });

          const isValid = await comparePassword(password, user.password);
          if (!isValid) return done(null, false, { message: "Credenciales inválidas" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de sesión actual: valida el JWT que viaja en la cookie
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await usersDao.findById(jwt_payload.id);
          if (!user) return done(null, false);

          const { password, ...safeUser } = user.toObject();
          return done(null, safeUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};