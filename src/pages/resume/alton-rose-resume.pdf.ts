import type { APIRoute } from "astro";
import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    let browser: Awaited<ReturnType<typeof playwright.launch>> | undefined;

    try {
        browser = await playwright.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage({
            viewport: { width: 1280, height: 1000 },
        });

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

        await page.evaluate(() => document.fonts.ready);

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
