import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://salaryiq.vercel.app";

  // Fetch actual result metadata for dynamic OG images
  let ogParams = "verdict=fair&difference=0&min=100000&max=150000&currency=USD";

  try {
    const metadataUrl = `${appUrl}/api/results/${id}/metadata`;
    const response = await fetch(metadataUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const { success, data } = await response.json();
      if (success && data) {
        ogParams = `verdict=${data.verdict}&difference=${data.difference}&min=${data.min}&max=${data.max}&currency=${data.currency}`;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch metadata for OG image, using defaults:", error);
  }

  const ogImageUrl = `${appUrl}/api/og?${ogParams}`;

  return {
    title: "Your Salary Analysis Results | SalaryIQ",
    description: "View your personalized salary analysis with AI-powered insights",
    openGraph: {
      title: "My Salary Analysis Results",
      description: "I just discovered my true market value with SalaryIQ!",
      url: `${appUrl}/results/${id}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Salary Analysis Results",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "My Salary Analysis Results",
      description: "I just discovered my true market value with SalaryIQ!",
      images: [ogImageUrl],
    },
  };
}
