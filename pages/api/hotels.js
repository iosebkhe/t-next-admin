import { Hotel } from "@/models/Hotel";
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
        // Fetch hotel by ID
        const hotel = await Hotel.findById(id).populate('categories');
        if (hotel) {
          res.json(hotel);
        } else {
          res.status(404).json({ error: 'Hotel not found' });
        }
      } else if (category) {
        // Fetch hotels by category name
        const categoryDoc = await Category.findOne({ name: category });

        if (categoryDoc) {
          // Use $in operator to match hotels that have the category's _id in their categories array
          const hotels = await Hotel.find({ categories: { $in: [categoryDoc._id] } }).populate('categories');
          res.json(hotels);
        } else {
          res.status(404).json({ error: 'Category not found' });
        }
      } else {
        // Fetch all hotels if no category or id is provided
        const hotels = await Hotel.find().populate('categories');
        res.json(hotels);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }


  if (method === 'POST') {
    await isAdminRequest(req, res);

    const {
      title,
      description,
      descriptionSmall,
      images,
      categories,
      availableRooms,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor
    } = req.body;

    const hotelDoc = await Hotel.create({
      title,
      description,
      descriptionSmall,
      images,
      categories,
      availableRooms,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor
    });
    res.json(hotelDoc);
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
      availableRooms,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor,
    } = req.body;

    await Hotel.updateOne({ _id }, {
      title,
      description,
      descriptionSmall,
      images,
      categories,
      availableRooms,
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
      await Hotel.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}