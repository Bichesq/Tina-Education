import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";
import { put, del } from "@vercel/blob";

// Define text element types for structured content
interface TextElement {
  type: "heading" | "paragraph" | "list-item" | "text";
  content: string;
  level?: number; // For headings (1-6) and list indentation
  children?: TextElement[];
  formatting?: {
    bold?: boolean;
    italic?: boolean;
  };
}

// Font configuration
interface FontConfig {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
}

// Rendering context
interface RenderContext {
  page: PDFPage;
  yPosition: number;
  fonts: FontConfig;
  margin: number;
  maxWidth: number;
  lineHeight: number;
  pdfDoc: PDFDocument;
  pageWidth: number;
  pageHeight: number;
}

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

    // Embed fonts
    const fonts: FontConfig = {
      regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
      boldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
    };

    const margin = 50;
    const maxWidth = width - margin * 2;
    const lineHeight = 16;
    const yPosition = height - 50;

    // Initialize render context
    const context: RenderContext = {
      page: currentPage,
      yPosition,
      fonts,
      margin,
      maxWidth,
      lineHeight,
      pdfDoc,
      pageWidth: width,
      pageHeight: height,
    };

    // Add title if provided
    if (title) {
      context.yPosition = drawText(context, title, {
        font: fonts.bold,
        size: 20,
        color: rgb(0, 0, 0),
      });
      context.yPosition -= 20;
    }

    // Add author if provided
    if (author) {
      context.yPosition = drawText(context, `Author: ${author}`, {
        font: fonts.regular,
        size: 12,
        color: rgb(0.5, 0.5, 0.5),
      });
      context.yPosition -= 20;
    }

    // Parse HTML content into structured elements
    const elements = parseHtmlContent(content);

    // Render all elements
    for (const element of elements) {
      context.yPosition = renderElement(context, element);
    }

    // Update the current page reference
    currentPage = context.page;

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

// Helper function to parse HTML content into structured elements
function parseHtmlContent(html: string): TextElement[] {
  const elements: TextElement[] = [];

  // Clean up HTML entities first
  const cleanHtml = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // First, handle inline formatting (bold, italic) by converting to markers
  const processedHtml = cleanHtml
    .replace(
      /<(strong|b)([^>]*)>(.*?)<\/(strong|b)>/gi,
      "**BOLD_START**$3**BOLD_END**"
    )
    .replace(
      /<(em|i)([^>]*)>(.*?)<\/(em|i)>/gi,
      "**ITALIC_START**$3**ITALIC_END**"
    );

  // Parse different HTML elements
  const htmlParts = processedHtml.split(
    /(<\/?(?:h[1-6]|p|ul|ol|li|br)[^>]*>)/gi
  );

  let currentElement: TextElement | null = null;
  let listLevel = 0;

  for (let i = 0; i < htmlParts.length; i++) {
    const part = htmlParts[i].trim();
    if (!part) continue;

    // Check if it's an HTML tag
    if (part.startsWith("<")) {
      const tagMatch = part.match(/<\/?([a-z0-9]+)/i);
      if (!tagMatch) continue;

      const tag = tagMatch[1].toLowerCase();
      const isClosing = part.startsWith("</");

      if (tag.match(/^h[1-6]$/)) {
        if (!isClosing) {
          const level = parseInt(tag.charAt(1));
          currentElement = { type: "heading", content: "", level };
        } else if (currentElement) {
          currentElement.content = processInlineFormatting(
            currentElement.content
          );
          elements.push(currentElement);
          currentElement = null;
        }
      } else if (tag === "p") {
        if (!isClosing) {
          currentElement = { type: "paragraph", content: "" };
        } else if (currentElement) {
          currentElement.content = processInlineFormatting(
            currentElement.content
          );
          elements.push(currentElement);
          currentElement = null;
        }
      } else if (tag === "br") {
        if (currentElement) {
          currentElement.content += "\n";
        } else {
          elements.push({ type: "text", content: "\n" });
        }
      } else if (tag === "ul" || tag === "ol") {
        if (!isClosing) {
          listLevel++;
        } else {
          listLevel = Math.max(0, listLevel - 1);
        }
      } else if (tag === "li") {
        if (!isClosing) {
          currentElement = { type: "list-item", content: "", level: listLevel };
        } else if (currentElement) {
          currentElement.content = processInlineFormatting(
            currentElement.content
          );
          elements.push(currentElement);
          currentElement = null;
        }
      }
    } else {
      // It's text content
      if (currentElement) {
        currentElement.content += part;
      } else {
        // Text outside of any element, treat as paragraph
        const processedContent = processInlineFormatting(part);
        elements.push({ type: "paragraph", content: processedContent });
      }
    }
  }

  // Add any remaining element
  if (currentElement) {
    currentElement.content = processInlineFormatting(currentElement.content);
    elements.push(currentElement);
  }

  return elements.filter((el) => el.content.trim().length > 0);
}

// Helper function to process inline formatting markers
function processInlineFormatting(text: string): string {
  // For now, we'll strip the markers and return clean text
  // In a more advanced implementation, we could parse these into text segments with formatting
  return text
    .replace(/\*\*BOLD_START\*\*/g, "")
    .replace(/\*\*BOLD_END\*\*/g, "")
    .replace(/\*\*ITALIC_START\*\*/g, "")
    .replace(/\*\*ITALIC_END\*\*/g, "");
}

// Helper function to render a single element
function renderElement(context: RenderContext, element: TextElement): number {
  switch (element.type) {
    case "heading":
      return renderHeading(context, element);
    case "paragraph":
      return renderParagraph(context, element);
    case "list-item":
      return renderListItem(context, element);
    default:
      return renderParagraph(context, element);
  }
}

// Helper function to render headings
function renderHeading(context: RenderContext, element: TextElement): number {
  const level = element.level || 1;
  const sizes = [18, 16, 14, 13, 12, 11]; // Font sizes for h1-h6
  const size = sizes[Math.min(level - 1, 5)];

  // Add extra space before heading (except at top of page)
  if (context.yPosition < context.pageHeight - 100) {
    context.yPosition -= context.lineHeight;
  }

  context.yPosition = drawText(context, element.content, {
    font: context.fonts.bold,
    size,
    color: rgb(0, 0, 0),
  });

  // Add space after heading
  context.yPosition -= context.lineHeight * 0.5;

  return context.yPosition;
}

// Helper function to render paragraphs
function renderParagraph(context: RenderContext, element: TextElement): number {
  // Add space before paragraph
  context.yPosition -= context.lineHeight * 0.3;

  context.yPosition = drawText(context, element.content, {
    font: context.fonts.regular,
    size: 12,
    color: rgb(0, 0, 0),
  });

  // Add space after paragraph
  context.yPosition -= context.lineHeight * 0.7;

  return context.yPosition;
}

// Helper function to render list items
function renderListItem(context: RenderContext, element: TextElement): number {
  const indent = (element.level || 1) * 20;
  const bullet = "• ";

  // Draw bullet
  context.page.drawText(bullet, {
    x: context.margin + indent,
    y: context.yPosition,
    size: 12,
    font: context.fonts.regular,
    color: rgb(0, 0, 0),
  });

  // Draw text with proper indentation
  const bulletWidth = context.fonts.regular.widthOfTextAtSize(bullet, 12);
  const textX = context.margin + indent + bulletWidth;
  const availableWidth = context.maxWidth - indent - bulletWidth;

  context.yPosition = drawWrappedText(context, element.content, {
    font: context.fonts.regular,
    size: 12,
    color: rgb(0, 0, 0),
    x: textX,
    maxWidth: availableWidth,
  });

  // Add space after list item
  context.yPosition -= context.lineHeight * 0.3;

  return context.yPosition;
}

// Helper function to draw text with automatic wrapping
function drawText(
  context: RenderContext,
  text: string,
  options: {
    font: PDFFont;
    size: number;
    color: ReturnType<typeof rgb>;
    x?: number;
    maxWidth?: number;
  }
): number {
  const x = options.x || context.margin;
  const maxWidth = options.maxWidth || context.maxWidth;

  return drawWrappedText(context, text, {
    ...options,
    x,
    maxWidth,
  });
}

// Helper function to draw wrapped text
function drawWrappedText(
  context: RenderContext,
  text: string,
  options: {
    font: PDFFont;
    size: number;
    color: ReturnType<typeof rgb>;
    x: number;
    maxWidth: number;
  }
): number {
  const words = text.trim().split(/\s+/);
  let line = "";
  let yPosition = context.yPosition;

  for (const word of words) {
    const testLine = line + word + " ";
    const testWidth = options.font.widthOfTextAtSize(testLine, options.size);
    const wordWidth = options.font.widthOfTextAtSize(word, options.size);

    // Handle very long words that exceed maxWidth
    if (wordWidth > options.maxWidth) {
      // Draw current line if it has content
      if (line.trim()) {
        context.page.drawText(line.trim(), {
          x: options.x,
          y: yPosition,
          size: options.size,
          font: options.font,
          color: options.color,
        });
        yPosition -= context.lineHeight;
        line = "";

        // Check if we need a new page
        if (yPosition < context.margin) {
          context.page = context.pdfDoc.addPage();
          yPosition = context.pageHeight - context.margin;
        }
      }

      // Break the long word into smaller chunks
      let remainingWord = word;
      while (remainingWord.length > 0) {
        let chunk = "";
        for (let i = 0; i < remainingWord.length; i++) {
          const testChunk = chunk + remainingWord[i];
          if (
            options.font.widthOfTextAtSize(testChunk, options.size) >
            options.maxWidth
          ) {
            break;
          }
          chunk = testChunk;
        }

        if (chunk.length === 0) {
          chunk = remainingWord[0]; // At least take one character
        }

        context.page.drawText(chunk, {
          x: options.x,
          y: yPosition,
          size: options.size,
          font: options.font,
          color: options.color,
        });
        yPosition -= context.lineHeight;
        remainingWord = remainingWord.substring(chunk.length);

        // Check if we need a new page
        if (yPosition < context.margin && remainingWord.length > 0) {
          context.page = context.pdfDoc.addPage();
          yPosition = context.pageHeight - context.margin;
        }
      }
    } else if (testWidth > options.maxWidth && line !== "") {
      // Draw the current line
      context.page.drawText(line.trim(), {
        x: options.x,
        y: yPosition,
        size: options.size,
        font: options.font,
        color: options.color,
      });
      yPosition -= context.lineHeight;
      line = word + " ";

      // Check if we need a new page
      if (yPosition < context.margin) {
        context.page = context.pdfDoc.addPage();
        yPosition = context.pageHeight - context.margin;
      }
    } else {
      line = testLine;
    }
  }

  // Draw the last line
  if (line.trim()) {
    context.page.drawText(line.trim(), {
      x: options.x,
      y: yPosition,
      size: options.size,
      font: options.font,
      color: options.color,
    });
    yPosition -= context.lineHeight;

    // Check if we need a new page
    if (yPosition < context.margin) {
      context.page = context.pdfDoc.addPage();
      yPosition = context.pageHeight - context.margin;
    }
  }

  return yPosition;
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
