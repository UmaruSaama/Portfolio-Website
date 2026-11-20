/* Test analytics for the Navi prototype (PostHog). Not product UI.
   Paste the project API key ("phc_…", safe to publish: it can only send events) and the
   region host. Leave the key empty and nothing loads or leaves the browser.
   Privacy: anonymous IDs only, no cookies (memory persistence), inputs masked in recordings. */
(function () {
  var POSTHOG_KEY = "";                              // e.g. "phc_xxxxxxxxxxxxxxxx"
  var POSTHOG_HOST = "https://us.i.posthog.com";     // EU projects: "https://eu.i.posthog.com"
  if (!POSTHOG_KEY || /[?&]demo/.test(location.search) || /^(localhost|127\.)/.test(location.hostname)) return;

  // official loader snippet (loads array.js from PostHog's assets CDN)
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
  window.NAVI_ANALYTICS = function (event, props) { window.posthog.capture("navi_" + event, props); };
})();
