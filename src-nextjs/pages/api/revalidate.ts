import { NextApiRequest, NextApiResponse } from "next"
import { types } from "@quantcdn/quant-client"
import { quant } from "../../utils/quant"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let slug = request.query.slug as string
  const secret = request.query.secret as string

  // Validate secret.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) {
    return response.status(401).json({ message: "Invalid secret." })
  }

  // Validate slug.
  if (!slug) {
    return response.status(400).json({ message: "Invalid slug." })
  }

  try {
    await response.revalidate(slug)

    // Purge QuantCDN Edge caches.
    const p:types.URLPayload = {"url": slug}
    quant.project.purge(p)

    // @todo: Generate latest static export if enabled.
    // See https://github.com/vercel/next.js/issues/2954
    // https://github.com/vercel/next.js/issues/12593

    return response.json({})
  } catch (error) {
    return response.status(404).json({
      message: error.message,
    })
  }
}
