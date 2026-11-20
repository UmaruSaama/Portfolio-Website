/* Test analytics for the Navi prototype: PostHog (events, funnels, replays) + Microsoft Clarity (replays, heatmaps).
   Not product UI. Paste the IDs below; an empty ID means that tool never loads.
   - PostHog project API key ("phc_…"): safe to publish, it can only send events.
   - Clarity project ID (the short code in Settings > Overview, e.g. "abc123xyz").
   Never loads on localhost or in ?demo recordings. Anonymous; PostHog keeps no cookies;
   inputs are masked in recordings. */
(function () {
  var POSTHOG_KEY = "";                              // e.g. "phc_xxxxxxxxxxxxxxxx"
  var POSTHOG_HOST = "https://us.i.posthog.com";     // EU projects: "https://eu.i.posthog.com"
  var CLARITY_ID = "";                               // e.g. "abc123xyz"

  if (/[?&]demo/.test(location.search) || /^(localhost|127\.)/.test(location.hostname)) return;
  var sinks = [];

  if (POSTHOG_KEY) {
    // official PostHog loader snippet (loads array.js from PostHog's assets CDN)
    !function (t, e) { var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset get_distinct_id startSessionRecording stopSessionRecording".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);
    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      persistence: "memory",          // no cookies, no local storage
      autocapture: false,             // the prototype sends its own named events
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: false,
      session_recording: { maskAllInputs: true }
    });
    window.posthog.register({ prototype: "navi-late-checkin", build: "v8" });
    sinks.push(function (event, props) { window.posthog.capture("navi_" + event, props); });
  }

  if (CLARITY_ID) {
    // official Microsoft Clarity loader snippet
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }; t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", CLARITY_ID);
    window.clarity("set", "prototype", "navi-late-checkin");
    sinks.push(function (event, props) {
      // Clarity events are names only; tags let you filter recordings by screen and conditions
      if (event === "screen_view") window.clarity("set", "last_screen", props.screen || "");
      if (event === "scenario_pick") window.clarity("set", "scenario", props.pick || "");
      window.clarity("event", event === "screen_view" ? "screen_" + props.screen : event === "tap" ? "tap_" + (props.screen || "") : event);
    });
  }

  if (sinks.length) window.NAVI_ANALYTICS = function (event, props) { sinks.forEach(function (s) { try { s(event, props); } catch (e) {} }); };
})();
