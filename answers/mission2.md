# Mission 2: Console attack, sabotage the purge button

## Evidence

The button dodges (two positions), with my attacker counter visible:

![position 1](https://github.com/user-attachments/assets/bfa11c49-80df-4e3f-be06-a13815ef6a39)
![position 2](https://github.com/user-attachments/assets/81c41f9f-3a49-40c8-b8b8-8f5e4f3e6d6c)


A legitimate click does nothing after my attack (log still reads "No purge requested"):

![click does nothing](https://github.com/user-attachments/assets/e74a8e39-ed01-4a2f-a685-3f41ac28dfe0)

## My attack script

Paste the full contents of `attacks/m2_runaway.js`, with one sentence per block:

```js
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
```

- **How do you remove the portal's original click handler without reloading?**

  > I clone the button with original.cloneNode(true), which copies the element's structure and attributes but not any event listeners attached via addEventListener. Replacing the original element with this clone (original.replaceWith(btn)) leaves a visually identical button with no click behavio

- **How do you stop a keyboard user from triggering the button?**

  > I set btn.setAttribute("tabindex", "-1"), which removes the button from the natural Tab order so keyboard-only operators can never focus it.

- **How do you keep the button fully inside `#danger-zone` and off its previous position?**

  > I use zone.clientWidth/clientHeight and btn.offsetWidth/offsetHeight to calculate the maximum valid left/top values, then generate a random position with Math.random() * (zoneWidth - btnWidth) so the button can never extend past the zone's edges. A do...while loop rejects any new position that's too close to the last one (within one button-width/height), ensuring visible movement each time.

## Creativity: my twist, R5

>   // TODO R5: your creative twist.
// R5: creative twist — taunt message that escalates with dodge count
btn.addEventListener("pointerenter", () => {
  if (dodgeCount >= 10) {
    btn.textContent = "Give up.";
  } else if (dodgeCount >= 5) {
    btn.textContent = "Too slow!";
  } else {
    btn.textContent = "Catch me!";
  }

## Think like a defender

The mouse trick is theater. The real problem is that attacker code ran in the operator's page at all. If "Purge All Incidents" were a real, destructive action:

1. Where must the actual protection live?

   > The actual protection must live on the server. Anything enforced only in the browser's DOM can be changed or removed by any script running on the page.

2. What should the server check on every purge request? Name at least two things.

   > The server should verify the requester is authenticated and has permission to perform a purge, and it should validate that the request includes a genuine confirmation token instead of trusting that it came from a legitimate button click.

3. Which Unit 1.3 slide or takeaway does this map to?

   > slide 46 similar to what we did in class. did not change anything in the server but the output was still different.

## Documentation log

| Page I used, with URL | One thing I learned from it |
|---|---|
| | |
