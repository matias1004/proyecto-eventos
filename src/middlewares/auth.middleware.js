import passport from "passport";

export const auth = (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: "error", message: "No autenticado" });
    }
    req.user = user;
    next();
  })(req, res, next);
};