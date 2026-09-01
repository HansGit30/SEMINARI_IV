import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ynrjq21s',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const rawDocs = await cloudinary.api.resources({ resource_type: 'raw', max_results: 100 });
    const imgDocs = await cloudinary.api.resources({ resource_type: 'image', max_results: 100 });

    const combined = [...rawDocs.resources, ...imgDocs.resources];
    return res.status(200).json(combined);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}