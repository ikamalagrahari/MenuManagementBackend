// Basic validation middleware
const validateCategory = (req, res, next) => {
  const { name, image, description, taxApplicability } = req.body;
  if (!name || !image || !description || taxApplicability === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (taxApplicability && (!req.body.tax || !req.body.taxType)) {
    return res.status(400).json({ error: 'Tax and taxType required if taxApplicability is true' });
  }
  next();
};

const validateSubcategory = (req, res, next) => {
  const { name, image, description, categoryId } = req.body;
  if (!name || !image || !description || !categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

const validateItem = (req, res, next) => {
  const { name, image, description, taxApplicability, baseAmount, categoryId } = req.body;
  if (!name || !image || !description || taxApplicability === undefined || !baseAmount || !categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (taxApplicability && !req.body.tax) {
    return res.status(400).json({ error: 'Tax required if taxApplicability is true' });
  }
  next();
};

module.exports = {
  validateCategory,
  validateSubcategory,
  validateItem,
};