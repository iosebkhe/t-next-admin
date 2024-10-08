import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    res.json(await Category.find());
  }

  if (method === 'POST') {
    await isAdminRequest(req, res);

    const { name } = req.body;
    const categoryDoc = await Category.create({
      name,
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    await isAdminRequest(req, res);

    const { name, _id } = req.body;
    const categoryDoc = await Category.updateOne({ _id }, {
      name,
    });
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    await isAdminRequest(req, res);

    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json('ok');
  }
}
