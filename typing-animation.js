document.addEventListener('DOMContentLoaded', function() {
  const nameSpan = document.getElementById('typed-name');
  const fullName = 'Karina Shah';
  let index = 0;

  function type() {
    if (index < fullName.length) {
      nameSpan.textContent += fullName.charAt(index);
      index++;
      // Adjust typing speed here (e.g., 150ms)
      // This timeout should roughly match the 'typing' animation duration in CSS for the number of characters
      // For 'Karina Shah' (11 chars), if animation is 2s with 11 steps, then 2000ms / 11 chars ~= 181ms per char
      setTimeout(type, 180);
    } else {
      // Optional: After typing, ensure the cursor remains but stops blinking or changes behavior
      // For now, the CSS animation handles the blinking indefinitely.
      // If you want the blinking to stop after typing:
      // nameSpan.style.borderRight = '.15em solid orange'; // Keep cursor visible
      // nameSpan.style.animation = 'none'; // Stop blinking
      // Or, to remove the cursor after typing:
      // nameSpan.style.borderRight = 'none';
    }
  }

  // Clear the span content initially in case there's any predefined text (though we removed it from HTML)
  if (nameSpan) {
    nameSpan.textContent = '';
    type();
  } else {
    console.error('Element with ID "typed-name" not found.');
  }
}); 