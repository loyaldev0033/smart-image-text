import { NextResponse } from "next/server";

// Optional: set GOOGLE_FONTS_API_KEY in env to fetch the full list
const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json([
      { family: "Inter" },
      { family: "Roboto" },
      { family: "Open Sans" },
      { family: "Montserrat" },
      { family: "Lato" },
      { family: "Poppins" },
      { family: "Oswald" },
      { family: "Merriweather" },
      { family: "Playfair Display" },
      { family: "Raleway" },
    ]);
  }
  try {
    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${API_KEY}`,
      { next: { revalidate: 60 * 60 } }
    );
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const list = items.map((i: any) => ({ family: i.family }));
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json([{ family: "Inter" }, { family: "Roboto" }]);
  }
}