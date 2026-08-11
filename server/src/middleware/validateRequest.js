export function validatePrompt(req, res, next) {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Request body must contain a valid non-empty prompt string.',
    });
  }
  next();
}
