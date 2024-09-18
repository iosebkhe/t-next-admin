import { Story } from "@/models/Story";
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
        // Fetch story by ID
        const story = await Story.findById(id).populate('categories');
        if (story) {
          res.json(story);
        } else {
          res.status(404).json({ error: 'Story not found' });
        }
      } else if (category) {
        // Fetch stories by category name
        const categoryDoc = await Category.findOne({ name: category });

        if (categoryDoc) {
          // Use $in operator to match stories that have the category's _id in their categories array
          const stories = await Story.find({ categories: { $in: [categoryDoc._id] } }).populate('categories');
          res.json(stories);
        } else {
          res.status(404).json({ error: 'Category not found' });
        }
      } else {
        // Fetch all stories if no category or id is provided
        const stories = await Story.find().populate('categories');
        res.json(stories);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }


  if (method === 'POST') {
    // await isAdminRequest(req, res);

    const {
      title,
      description,
      descriptionSmall,
      images,
      categories,
      price,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor
    } = req.body;

    const storyDoc = await Story.create({
      title,
      description,
      descriptionSmall,
      images,
      categories,
      price,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor
    });
    res.json(storyDoc);
  }

  if (method === 'PUT') {
    await isAdminRequest(req, res);

    const {
      _id,
      title,
      description,
      descriptionSmall,
      images,
      categories,
      price,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor,
    } = req.body;

    await Story.updateOne({ _id }, {
      title,
      description,
      descriptionSmall,
      images,
      categories,
      price,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor,
    });

    res.json(true);
  }

  if (method === 'DELETE') {
    await isAdminRequest(req, res);

    if (req.query?.id) {
      await Story.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}