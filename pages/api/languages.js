import { Language } from "@/models/Language";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    res.json(await Language.find());
  }

  if (method === 'POST') {
    await isAdminRequest(req, res);

    const { name } = req.body;
    const languageDoc = await Language.create({
      name,
    });
    res.json(languageDoc);
  }

  if (method === 'PUT') {
    await isAdminRequest(req, res);

    const { name, _id } = req.body;
    const languageDoc = await Language.updateOne({ _id }, {
      name,
    });
    res.json(languageDoc);
  }

  if (method === 'DELETE') {
    await isAdminRequest(req, res);

    const { _id } = req.query;
    await Language.deleteOne({ _id });
    res.json('ok');
  }
}
