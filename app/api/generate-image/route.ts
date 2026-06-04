const VENUE_PROMPTS: Record<string, string> = {
  "performing live on stage":
    "on a dramatic concert stage, purple and white spotlights cutting through haze, crowd silhouettes in background, smoke machine, epic atmosphere",
  "recording in a studio":
    "in a professional recording studio, warm overhead lighting, vintage amplifiers, mixing desk visible in background, acoustic panels on walls, golden hour ambience",
  "jamming in the garage":
    "in a dimly lit garage band rehearsal space, exposed brick walls, vintage Marshall amp, string lights, posters on walls, authentic lived-in atmosphere",
  "bedroom player at home":
    "in a cozy bedroom, warm bedside lamp, guitar posters on wall, unmade bed, casual intimate home setting, golden light",
};

function getVenuePrompt(venue?: string): string {
  if (!venue) return "in a music store with warm lighting, guitars hanging on the wall behind";
  return VENUE_PROMPTS[venue] ?? "in a beautifully lit music space";
}

export async function POST(req: Request) {
  const { guitarName, brand, venue } = await req.json();

  const venueDesc = getVenuePrompt(venue);
  const prompt = `Professional atmospheric photograph of a ${brand} ${guitarName} guitar ${venueDesc}. The guitar is the hero of the shot. Dark moody cinematic lighting. Ultra detailed, photorealistic, shallow depth of field, 35mm lens. No people, guitar only.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "4:3" },
      }),
    }
  );

  const data = await res.json();
  const prediction = data?.predictions?.[0];
  if (!prediction?.bytesBase64Encoded) {
    return Response.json({ error: "Image generation failed" }, { status: 500 });
  }

  return Response.json({
    imageData: prediction.bytesBase64Encoded,
    mimeType: prediction.mimeType ?? "image/png",
  });
}
