const VENUE_PROMPTS: Record<string, string> = {
  "performing live on stage":
    "on a dramatic concert stage, purple and white spotlights cutting through haze, crowd silhouettes in background, smoke machine, epic atmosphere",
  "recording in a studio":
    "in a professional recording studio, warm overhead lighting, vintage amplifiers, mixing desk visible in background, acoustic panels on walls",
  "jamming in the garage":
    "in a dimly lit garage band rehearsal space, exposed brick walls, vintage Marshall amp, string lights, authentic lived-in feel",
  "bedroom player at home":
    "in a cozy bedroom, warm bedside lamp, guitar posters on wall, casual intimate home setting, golden light",
};

function getVenuePrompt(venue?: string): string {
  if (!venue) return "in a music store with warm lighting, guitars hanging on the wall";
  return VENUE_PROMPTS[venue] ?? "in a beautifully lit music space";
}

export async function POST(req: Request) {
  const { guitarName, brand, venue, userPhoto } = await req.json();
  const venueDesc = getVenuePrompt(venue);

  // Step 1: describe the person's appearance from their photo
  const describeRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: userPhoto.replace(/^data:image\/\w+;base64,/, ""),
                },
              },
              {
                text: "Describe this person's physical appearance in detail for an AI image generator: hair colour and style, skin tone, approximate age, face shape, any notable features. Be specific and concise. 2-3 sentences max.",
              },
            ],
          },
        ],
      }),
    }
  );

  const describeData = await describeRes.json();
  const personDescription =
    describeData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "a musician";

  // Step 2: generate the personalised guitar image
  const prompt = `Cinematic photograph of ${personDescription} playing a ${brand} ${guitarName} guitar ${venueDesc}. The person is the focus, playing with passion. Moody dramatic lighting, photorealistic, 35mm lens, shallow depth of field, high quality.`;

  const genRes = await fetch(
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

  const genData = await genRes.json();
  const prediction = genData?.predictions?.[0];

  if (!prediction?.bytesBase64Encoded) {
    return Response.json({ error: "Personalisation failed" }, { status: 500 });
  }

  return Response.json({
    imageData: prediction.bytesBase64Encoded,
    mimeType: prediction.mimeType ?? "image/png",
    personDescription,
  });
}
