import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import * as authService from "../services/auth.service.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "currentUser";

const cookieExtractor = (req) => req?.cookies?.[COOKIE_NAME] || null;

export const initPassport = () => {
  // Registro: el service valida, hashea y crea el usuario
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await authService.registerUser(req.body);
          return done(null, user);
        } catch (error) {
          // Errores de negocio (400/409) llegan al controller como "info"; el resto sigue como error real
          if (error.status) {
            return done(null, false, { message: error.message, status: error.status });
          }
          return done(error);
        }
      }
    )
  );

  // Login: el service compara email + contraseña
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await authService.validateCredentials(email, password);
        if (!user) {
          return done(null, false, { message: "Credenciales inválidas", status: 401 });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Sesión actual: valida el JWT de la cookie y busca al usuario por id
  passport.use(
    "current",
    new JwtStrategy(
      { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
      async (payload, done) => {
        try {
          const user = await authService.getUserById(payload.id);
          return done(null, user || false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};