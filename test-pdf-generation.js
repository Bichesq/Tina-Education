const { generateAndStorePdf } = require('./lib/pdf-service.ts');

async function testPdfGeneration() {
  console.log('🧪 Testing PDF generation...');
  
  const testContent = `
    <h1>Test Manuscript Title</h1>
    <p>This is a test manuscript with multiple paragraphs to verify that the PDF generation works correctly.</p>
    
    <p>This paragraph contains <strong>bold text</strong> and <em>italic text</em> that should be stripped of HTML tags but maintain readability.</p>
    
    <p>Here's a very long paragraph that should wrap across multiple lines and demonstrate proper word wrapping functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    
    <p>This paragraph tests line breaks<br>and should show proper<br>line handling.</p>
    
    <p>Here's another paragraph with some special characters: &amp; &lt; &gt; &quot; &#39; and &nbsp; spaces.</p>
    
    <p>This is a test of a very long word that might exceed the maximum width: supercalifragilisticexpialidocious-extraordinarily-long-hyphenated-word-that-should-be-broken-appropriately.</p>
    
    <p>Final paragraph to test multiple page generation. This content should be long enough to potentially span multiple pages when combined with all the previous content. We want to ensure that page breaks work correctly and that text doesn't overlap or get cut off.</p>
  `;
  
  try {
    const result = await generateAndStorePdf(
      testContent,
      'Test Manuscript Title',
      'Test Author'
    );
    
    if (result) {
      console.log('✅ PDF generation successful!');
      console.log(`📄 PDF URL: ${result}`);
      console.log('🔗 You can open this URL in a browser to view the generated PDF');
    } else {
      console.log('❌ PDF generation failed');
    }
  } catch (error) {
    console.error('❌ Error during PDF generation:', error);
  }
}

// Run the test
testPdfGeneration();
