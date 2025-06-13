const { generateAndStorePdf } = require('./lib/pdf-service.ts');

async function testEnhancedPdfGeneration() {
  console.log('🧪 Testing Enhanced PDF generation...');
  
  const testContent = `
    <h1>Enhanced PDF Test Document</h1>
    <p>This is a test document to verify that the enhanced PDF generation properly handles HTML formatting.</p>
    
    <h2>Text Formatting</h2>
    <p>This paragraph contains <strong>bold text</strong> and <em>italic text</em> that should be properly formatted in the PDF.</p>
    
    <h3>Lists</h3>
    <p>Here's an unordered list:</p>
    <ul>
      <li>First item with <strong>bold</strong> text</li>
      <li>Second item with <em>italic</em> text</li>
      <li>Third item with regular text</li>
    </ul>
    
    <p>And here's an ordered list:</p>
    <ol>
      <li>First numbered item</li>
      <li>Second numbered item</li>
      <li>Third numbered item</li>
    </ol>
    
    <h4>Paragraphs and Line Breaks</h4>
    <p>This is the first paragraph with proper spacing.</p>
    <p>This is the second paragraph that should have proper spacing from the first.</p>
    
    <p>This paragraph has a line break<br>in the middle of it.</p>
    
    <h5>Headings Hierarchy</h5>
    <p>The document should show different font sizes for different heading levels (h1-h6).</p>
    
    <h6>Smallest Heading</h6>
    <p>This is under the smallest heading level.</p>
  `;
  
  try {
    const result = await generateAndStorePdf(
      testContent,
      'Enhanced PDF Test Document',
      'Test Author'
    );
    
    if (result) {
      console.log('✅ Enhanced PDF generation successful!');
      console.log(`📄 PDF URL: ${result}`);
      console.log('🔗 You can open this URL in a browser to view the enhanced PDF with proper formatting');
      console.log('');
      console.log('Expected improvements:');
      console.log('- ✅ Proper heading hierarchy with different font sizes');
      console.log('- ✅ Structured paragraphs with proper spacing');
      console.log('- ✅ Bulleted lists with proper indentation');
      console.log('- ✅ Line breaks handled correctly');
      console.log('- ✅ Better overall document structure');
    } else {
      console.log('❌ Enhanced PDF generation failed');
    }
  } catch (error) {
    console.error('❌ Error during enhanced PDF generation:', error.message);
  }
}

// Run the test
testEnhancedPdfGeneration();
