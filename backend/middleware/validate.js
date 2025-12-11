export const validateBody = (schema) => (req, res, next) => {
  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    const errors = parseResult.error.errors.map(e => ({ path: e.path.join("."), message: e.message }));
    return res.status(400).json({ message: "Validation failed", errors });
  }
  // replace body with parsed (coerced) value to ensure correct types
  req.body = parseResult.data;
  next();
};
