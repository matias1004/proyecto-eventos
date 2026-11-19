export const notFound = (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.name === "CastError") {
    status = 400;
    message = "El ID recibido no es válido";
  } else if (err.name === "ValidationError") {
    status = 400;
  } else if (err.code === 11000) {
    status = 409;
    message = "Ya existe un registro con esos datos";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "El JSON enviado no es válido";
  }

  if (status >= 500) {
    console.error(err);
    message = "Error interno del servidor";
  }

  res.status(status).json({ status: "error", message });
};