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
    let currentPage = pdfDoc.addPage();
    const { width, height } = currentPage.getSize();

    // Embed font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 20;

    // Add title if provided
    if (title) {
      currentPage.drawText(title, {
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
      currentPage.drawText(`Author: ${author}`, {
        x: margin,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
      yPosition -= 30;
    }

    // Strip HTML tags and process content more thoroughly
    const cleanContent = content
      .replace(/<br\s*\/?>/gi, "\n") // Convert <br> tags to newlines
      .replace(/<\/p>/gi, "\n\n") // Convert </p> tags to paragraph breaks
      .replace(/<p[^>]*>/gi, "") // Remove <p> opening tags
      .replace(/<[^>]*>/g, "") // Remove all other HTML tags
      .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
      .replace(/&amp;/g, "&") // Replace HTML entities
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Split content into paragraphs and then words
    const paragraphs = cleanContent.split(/\n\s*\n/).filter((p) => p.trim());
    const maxWidth = width - margin * 2;

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      if (!paragraph) continue;

      // Add extra space between paragraphs (except for the first one)
      if (i > 0) {
        yPosition -= lineHeight * 0.5;
      }

      const words = paragraph.split(/\s+/);
      let line = "";

      for (const word of words) {
        const testLine = line + word + " ";
        const testWidth = font.widthOfTextAtSize(testLine, 12);
        const wordWidth = font.widthOfTextAtSize(word, 12);

        // Handle very long words that exceed maxWidth
        if (wordWidth > maxWidth) {
          // Draw current line if it has content
          if (line.trim()) {
            currentPage.drawText(line.trim(), {
              x: margin,
              y: yPosition,
              size: 12,
              font: font,
              color: rgb(0, 0, 0),
            });
            yPosition -= lineHeight;
            line = "";

            // Check if we need a new page
            if (yPosition < margin) {
              currentPage = pdfDoc.addPage();
              yPosition = height - margin;
            }
          }

          // Break the long word into smaller chunks
          let remainingWord = word;
          while (remainingWord.length > 0) {
            let chunk = "";
            for (let i = 0; i < remainingWord.length; i++) {
              const testChunk = chunk + remainingWord[i];
              if (font.widthOfTextAtSize(testChunk, 12) > maxWidth) {
                break;
              }
              chunk = testChunk;
            }

            if (chunk.length === 0) {
              chunk = remainingWord[0]; // At least take one character
            }

            currentPage.drawText(chunk, {
              x: margin,
              y: yPosition,
              size: 12,
              font: font,
              color: rgb(0, 0, 0),
            });
            yPosition -= lineHeight;
            remainingWord = remainingWord.substring(chunk.length);

            // Check if we need a new page
            if (yPosition < margin && remainingWord.length > 0) {
              currentPage = pdfDoc.addPage();
              yPosition = height - margin;
            }
          }
        } else if (testWidth > maxWidth && line !== "") {
          // Draw the current line
          currentPage.drawText(line.trim(), {
            x: margin,
            y: yPosition,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          line = word + " ";

          // Check if we need a new page
          if (yPosition < margin) {
            currentPage = pdfDoc.addPage();
            yPosition = height - margin;
          }
        } else {
          line = testLine;
        }
      }

      // Draw the last line of the paragraph
      if (line.trim()) {
        currentPage.drawText(line.trim(), {
          x: margin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;

        // Check if we need a new page after drawing the last line
        if (yPosition < margin && i < paragraphs.length - 1) {
          currentPage = pdfDoc.addPage();
          yPosition = height - margin;
        }
      }
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
