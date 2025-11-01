import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://salaryiq.vercel.app";

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
          url: `${appUrl}/api/og?verdict=fair&difference=0&min=100000&max=150000`,
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
      images: [`${appUrl}/api/og?verdict=fair&difference=0&min=100000&max=150000`],
    },
  };
}
