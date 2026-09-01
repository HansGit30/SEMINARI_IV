import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "ynrjq21s",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const rawRes = await cloudinary.api.resources({ resource_type: "raw", max_results: 100 });
    const imgRes = await cloudinary.api.resources({ resource_type: "image", max_results: 100 });

    const allResources = [...rawRes.resources, ...imgRes.resources];
    return res.status(200).json(allResources);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}