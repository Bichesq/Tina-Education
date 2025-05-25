import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { put, del } from "@vercel/blob";

export async function generateAndStorePdf(
  content: string,
  title?: string,
  author?: string
): Promise<string | null> {
  try {
    console.log("📄 Starting PDF generation...");

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Embed font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 20;

    // Add title if provided
    if (title) {
      page.drawText(title, {
        x: margin,
        y: yPosition,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 30;
    }

    // Add author if provided
    if (author) {
      page.drawText(`Author: ${author}`, {
        x: margin,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
      yPosition -= 30;
    }

    // Add content with word wrapping
    const words = content.split(' ');
    let line = '';
    const maxWidth = width - (margin * 2);

    for (const word of words) {
      const testLine = line + word + ' ';
      const textWidth = font.widthOfTextAtSize(testLine, 12);

      if (textWidth > maxWidth && line !== '') {
        // Draw the current line
        page.drawText(line.trim(), {
          x: margin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
        line = word + ' ';

        // Check if we need a new page
        if (yPosition < margin) {
          const newPage = pdfDoc.addPage();
          yPosition = newPage.getSize().height - margin;
        }
      } else {
        line = testLine;
      }
    }

    // Draw the last line
    if (line.trim()) {
      page.drawText(line.trim(), {
        x: margin,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    console.log("✅ PDF generated successfully");

    // Upload to Vercel Blob
    const filename = `manuscript-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;
    console.log(`📤 Uploading PDF to Vercel Blob: ${filename}`);

    const blob = await put(`manuscripts/${filename}`, Buffer.from(pdfBytes), {
      access: "public",
      contentType: "application/pdf",
    });

    console.log(`✅ PDF uploaded successfully: ${blob.url}`);
    return blob.url;

  } catch (error) {
    console.error("❌ PDF generation/upload failed:", error);
    return null;
  }
}

export async function deletePdf(url: string): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting PDF: ${url}`);
    await del(url);
    console.log("✅ PDF deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ PDF deletion failed:", error);
    return false;
  }
}
