function splitSentenceIntoFour(sentence) {
  // Remove leading/trailing whitespace
  const trimmed = sentence.trim();
  
  if (trimmed.length === 0) {
    return ['', '', '', ''];
  }
  
  // Split into words while preserving punctuation
  const words = trimmed.split(/\s+/);
  
  if (words.length === 0) {
    return ['', '', '', ''];
  }
  
  // If we have fewer than 4 words, distribute them among the parts
  if (words.length <= 4) {
    const parts = ['', '', '', ''];
    for (let i = 0; i < words.length; i++) {
      parts[i] = words[i];
    }
    return parts;
  }
  
  // Calculate target length for each part
  const totalLength = trimmed.length;
  const targetLength = Math.ceil(totalLength / 4);
  
  const parts = [];
  let currentPart = [];
  let currentLength = 0;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const spaceLength = currentPart.length > 0 ? 1 : 0; // Space before word
    const newLength = currentLength + spaceLength + word.length;
    
    // If we haven't filled 3 parts yet and adding this word would exceed target
    if (parts.length < 3 && currentPart.length > 0 && newLength > targetLength) {
      // Close current part and start new one
      parts.push(currentPart.join(' '));
      currentPart = [word];
      currentLength = word.length;
    } else {
      // Add word to current part
      currentPart.push(word);
      currentLength = newLength;
    }
  }
  
  // Add the final part
  if (currentPart.length > 0) {
    parts.push(currentPart.join(' '));
  }
  
  // Fill remaining parts with empty strings if needed
  while (parts.length < 4) {
    parts.push('');
  }
  
  return parts;
}

// Helper function to show character counts for testing
function testSplit(sentence) {
  const result = splitSentenceIntoFour(sentence);
  console.log(`Original: "${sentence}" (${sentence.trim().length} chars)`);
  result.forEach((part, i) => {
    console.log(`Part ${i + 1}: "${part}" (${part.length} chars)`);
  });
  console.log('---');
  return result;
}

// Example usage:
testSplit("This is a test sentence for splitting into four parts.");

testSplit("The quick brown fox jumps over the lazy dog.");

testSplit("JavaScript programming language is very powerful and flexible for web development.");

testSplit("Hello, world! How are you today?");

testSplit("Supercalifragilisticexpialidocious is a very long word indeed.");

testSplit("One two three");