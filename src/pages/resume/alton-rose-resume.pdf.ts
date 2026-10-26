import type { APIRoute } from "astro";
import { chromium } from "playwright";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

    try {
        browser = await chromium.launch({ headless: true });

        const page = await browser.newPage({
            viewport: { width: 1280, height: 1000 },
        });

        // Open the actual Astro page, so its rendered content and CSS are used.
        const resumeUrl = new URL("/resume", request.url);
        const pageResponse = await page.goto(resumeUrl.href, {
            waitUntil: "networkidle",
        });

        if (!pageResponse?.ok()) {
            return new Response("Could not load the resume page.", {
                status: 502,
                headers: { "content-type": "text/plain" },
            });
        }

        // Wait for web fonts before printing.
        await page.evaluate(() => document.fonts.ready);

        // Print-specific adjustments: use the printable page width instead of
        // the screen's lg:w-1/2 width, while keeping the page's existing styles.
        await page.addStyleTag({
            content: `
        @page {
          size: Letter;
          margin: 0.5in;
        }

        @media print {
          main {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
          }

          *,
          *::before,
          *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `,
        });

        const pdf = await page.pdf({
            format: "Letter",
            printBackground: true,
            preferCSSPageSize: true,
        });

        return new Response(new Uint8Array(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="alton-rose-resume.pdf"',
            },
        });
    } catch (error) {
        console.error("Failed to generate resume PDF:", error);

        return new Response("Failed to generate PDF.", {
            status: 500,
            headers: { "content-type": "text/plain" },
        });
    } finally {
        await browser?.close();
    }
};
