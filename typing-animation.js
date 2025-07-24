document.addEventListener('DOMContentLoaded', function() {
  const nameSpan = document.getElementById('typed-name');
  const fullName = 'Karina Shah';
  let index = 0;

  function type() {
    if (index < fullName.length) {
      nameSpan.textContent += fullName.charAt(index);
      index++;
     
      setTimeout(type, 180);
    } else {
     
    }
  }

  if (nameSpan) {
    nameSpan.textContent = '';
    type();
  } else {
    console.error('Element with ID "typed-name" not found.');
  }
}); 
