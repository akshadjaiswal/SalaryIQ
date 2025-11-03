import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

// ============================================
// OPEN GRAPH IMAGE GENERATION
// ============================================

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const verdict = searchParams.get("verdict") || "fair";
    const difference = searchParams.get("difference") || "0";
    const minSalary = searchParams.get("min") || "0";
    const maxSalary = searchParams.get("max") || "0";
    const currency = searchParams.get("currency") || "USD";

    // Verdict styling
    const verdictConfig: Record<
      string,
      { bg: string; text: string; title: string; emoji: string }
    > = {
      underpaid: {
        bg: "#fee2e2",
        text: "#991b1b",
        title: "UNDERPAID",
        emoji: "📉",
      },
      fair: {
        bg: "#dcfce7",
        text: "#166534",
        title: "FAIRLY PAID",
        emoji: "✅",
      },
      overpaid: {
        bg: "#f3e8ff",
        text: "#6b21a8",
        title: "ABOVE MARKET",
        emoji: "🎉",
      },
    };

    const config = verdictConfig[verdict] || verdictConfig.fair;

    // Currency symbol mapping
    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      CAD: "$",
      AUD: "$",
    };

    const currencySymbol = currencySymbols[currency] || "$";

    // Format salary with currency
    const formatSalary = (amount: number) => {
      const formatted = amount.toLocaleString();
      return currency === "INR"
        ? `₹${formatted}`
        : `${currencySymbol}${formatted}`;
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          {/* Main Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px",
              backgroundColor: config.bg,
              borderRadius: "30px",
              border: `8px solid ${config.text}`,
            }}
          >
            {/* Logo/Title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <span
                style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  color: "#1e293b",
                }}
              >
                SalaryIQ
              </span>
            </div>

            {/* Verdict */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <span
                style={{
                  fontSize: "80px",
                  marginBottom: "20px",
                }}
              >
                {config.emoji}
              </span>
              <span
                style={{
                  fontSize: "64px",
                  fontWeight: "900",
                  color: config.text,
                  marginBottom: "20px",
                }}
              >
                {config.title}
              </span>
              <span
                style={{
                  fontSize: "56px",
                  fontWeight: "700",
                  color: config.text,
                }}
              >
                {difference}%
              </span>
            </div>

            {/* Salary Range */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                fontSize: "32px",
                color: "#475569",
              }}
            >
              <span>
                {formatSalary(parseInt(minSalary))} - {formatSalary(parseInt(maxSalary))}
              </span>
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: "50px",
                fontSize: "28px",
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              Discover your true market value
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
