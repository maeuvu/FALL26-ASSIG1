// =====================================================================
// MISSION 2 ATTACK: The Runaway Button
// =====================================================================
// Write your attack here, then COPY the whole file and PASTE it into the
// DevTools Console of http://localhost:3000.
//
// Everything is wrapped in (() => { ... })(); on purpose. It is an
// immediately invoked function: it lets you paste the script again after
// a page reload without "Identifier has already been declared" errors.
//
// Author:
// =====================================================================

(() => {
  const zone = document.getElementById("danger-zone");
  const original = document.getElementById("purge-btn");

  // TODO R1: remove the portal's legitimate click listener.
  // R1: remove the portal's legitimate click listener
const btn = original.cloneNode(true);
original.replaceWith(btn);
  // TODO R2: stop keyboard users from reaching the button.
  btn.setAttribute("tabindex", "-1");
  // TODO R3: make the button jump inside zone on every approach, no overlap.
let lastLeft = null; 
let lastTop = null; 

function dodge() { 
  const zoneWidth = zone.clientWidth; 
  const zoneHeight = zone.clientHeight; 
  const btnWidth = btn.offsetWidth; 
  const btnHeight = btn.offsetHeight; 
  
  let newLeft, newTop; 
  
  do { 
    newLeft = Math.random() * (zoneWidth - btnWidth); 
    newTop = Math.random() * (zoneHeight - btnHeight); 
  } while ( 
    lastLeft !== null && 
    Math.abs(newLeft - lastLeft) < btnWidth && 
    Math.abs(newTop - lastTop) < btnHeight 
  ); 
  
  lastLeft = newLeft; 
  lastTop = newTop; 
  
  btn.style.position = "absolute"; 
  btn.style.left = newLeft + "px"; 
  btn.style.top = newTop + "px"; 
} 

btn.addEventListener("pointerenter", dodge);


  // TODO R4: create a NEW element that shows the dodge counter.
let dodgeCount = 0;
const counter = document.createElement("div");
counter.id = "dodge-counter";
counter.textContent = "Dodges: 0";
zone.appendChild(counter);

btn.addEventListener("pointerenter", () => {
  dodgeCount += 1;
  counter.textContent = "Dodges: " + dodgeCount;
});

  // TODO R5: your creative twist.
// R5: creative twist — taunt message that escalates with dodge count
btn.addEventListener("pointerenter", () => {
  if (dodgeCount >= 10) {
    btn.textContent = "Give up.";
  } else if (dodgeCount >= 5) {
    btn.textContent = "Too slow!";
  } else {
    btn.textContent = "Catch me!";
  }
});
  console.log("[attack] runaway button installed");
})();
