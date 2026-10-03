var code = `(function () {
  document.addEventListener('click', (event) => {
    if (true) { return; }
  });
})();`;
try { new Function(code); console.log('Test 1: OK'); } catch(e) { console.log('Test 1: ' + e.message); }

var code2 = `(function () {
  if (true) { return; }
  document.addEventListener('click', (event) => {
    if (true) { return; }
  });
})();`;
try { new Function(code2); console.log('Test 2: OK'); } catch(e) { console.log('Test 2: ' + e.message); }

// Check what happens if we remove the closing }
var code3 = `(function () {
  document.addEventListener('click', (event) => {
    if (true) { return; }
  });
})();`;
// Add an extra { somewhere
var code3Modified = `(function () {
  var x = { a: 1
  document.addEventListener('click', (event) => {
    if (true) { return; }
  });
})();`;
try { new Function(code3Modified); console.log('Test 3: OK'); } catch(e) { console.log('Test 3: ' + e.message); }
