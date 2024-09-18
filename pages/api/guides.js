import { Guide } from "@/models/Guide";
import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    const { category, id } = req.query;

    try {
      if (id) {
        // Fetch guide by ID
        const guide = await Guide.findById(id).populate('categories');
        if (guide) {
          res.json(guide);
        } else {
          res.status(404).json({ error: 'Guide not found' });
        }
      } else if (category) {
        // Fetch guides by category name
        const categoryDoc = await Category.findOne({ name: category });

        if (categoryDoc) {
          // Use $in operator to match guides that have the category's _id in their categories array
          const guides = await Guide.find({ categories: { $in: [categoryDoc._id] } }).populate('categories');
          res.json(guides);
        } else {
          res.status(404).json({ error: 'Category not found' });
        }
      } else {
        // Fetch all guides if no category or id is provided
        const guides = await Guide.find().populate('categories');
        res.json(guides);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }


  if (method === 'POST') {
    await isAdminRequest(req, res);

    const {
      fullName,
      email,
      biography,
      languages,
      images,
      categories,
      phone,
      isCertified,
      certifications
    } = req.body;

    const guideDoc = await Guide.create({
      fullName,
      email,
      biography,
      languages,
      images,
      categories,
      phone,
      isCertified,
      certifications
    });
    res.json(guideDoc);
  }

  if (method === 'PUT') {
    await isAdminRequest(req, res);

    const {
      _id,
      fullName,
      email,
      biography,
      languages,
      images,
      categories,
      phone,
      isCertified,
      certifications
    } = req.body;

    await Guide.updateOne({ _id }, {
      fullName,
      email,
      biography,
      languages,
      images,
      categories,
      phone,
      isCertified,
      certifications
    });

    res.json(true);
  }

  if (method === 'DELETE') {
    await isAdminRequest(req, res);

    if (req.query?.id) {
      await Guide.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}