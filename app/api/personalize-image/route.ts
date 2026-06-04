import { readFileSync } from "fs";
import { join } from "path";

const VENUE_PROMPTS: Record<string, string> = {
  "performing live on stage":
    "on a dramatic concert stage, purple and white spotlights cutting through haze, crowd silhouettes in background",
  "recording in a studio":
    "in a professional recording studio, warm overhead lighting, vintage amplifiers, mixing desk visible",
  "jamming in the garage":
    "in a dimly lit garage band rehearsal space, exposed brick walls, vintage Marshall amp, string lights",
  "bedroom player at home":
    "in a cozy bedroom, warm bedside lamp, guitar posters on the wall, golden light",
};

function getVenuePrompt(venue?: string): string {
  if (!venue) return "on a concert stage with dramatic blue stage lighting";
  return VENUE_PROMPTS[venue] ?? "in a beautifully lit music space";
}

let personaBase64: string | null = null;
function getPersonaBase64(): string {
  if (!personaBase64) {
    const buf = readFileSync(join(process.cwd(), "public", "persona.jpg"));
    personaBase64 = buf.toString("base64");
  }
  return personaBase64;
}

export async function POST(req: Request) {
  const { guitarName, brand, venue, userPhoto } = await req.json();
  const venueDesc = getVenuePrompt(venue);

  // Use uploaded photo if provided, otherwise default to persona
  const photoB64 = userPhoto
    ? userPhoto.replace(/^data:image\/\w+;base64,/, "")
    : getPersonaBase64();

  const descRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: photoB64 } },
            { text: "Describe this person's exact appearance in 2-3 sentences for an AI image generator: age, hair, face, clothing, style. Be specific and visual." },
          ],
        }],
      }),
    }
  );

  const descData = await descRes.json();
  const personDescription = descData?.candidates?.[0]?.content?.parts?.[0]?.text
    ?? "a young man in his late 20s with short beard, beige cap, round sunglasses, dark navy shirt";

  const prompt = `Cinematic photograph of ${personDescription} playing a ${brand} ${guitarName} guitar ${venueDesc}. Playing with passion and focus. Moody dramatic lighting, photorealistic, 35mm lens, shallow depth of field.`;

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
