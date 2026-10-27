(function () {
  "use strict";

  var isEnglish = document.documentElement.lang.toLowerCase().indexOf("en") === 0;
  var isProduction = window.location.hostname === "x-pipeline.github.io";
  var namespace = isProduction ? "x-pipeline-github-io" : "x-pipeline-local";
  var visitorKey = "xp_visit_counted";
  var labels = isEnglish
    ? {
        sitePv: "Total page views",
        siteUv: "Unique visitors",
        pagePv: "Views on this page",
        times: ""
      }
    : {
        sitePv: "a",
        siteUv: "b",
        pagePv: "c",
        times: " "
      };

  function stat(key, label) {
    return (
      '<span class="visit-counter__item" data-counter="' + key + '" hidden>' +
      label +
      ' <span class="visit-counter__value"></span>' +
      (labels.times ? " " + labels.times : "") +
      "</span>"
    );
  }

  function pageKey() {
    var path = window.location.pathname
      .replace(/^\/|\/$/g, "")
      .replace(/\.html$/, "")
      .replace(/[^a-z0-9]+/gi, "-");
    return path || "home";
  }

  function requestCount(action, key) {
    return new Promise(function (resolve, reject) {
      var callback = "__xpCounter_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
      var script = document.createElement("script");
      var timeout = window.setTimeout(function () {
        cleanup();
        reject(new Error("Traffic counter timed out"));
      }, 10000);

      function cleanup() {
        window.clearTimeout(timeout);
        delete window[callback];
        script.remove();
      }

      window[callback] = function (data) {
        cleanup();
        resolve(Number(data.value));
      };
      script.onerror = function () {
        cleanup();
        reject(new Error("Traffic counter unavailable"));
      };
      script.src =
        "https://abacus.jasoncameron.dev/" +
        action +
        "/" +
        namespace +
        "/" +
        key +
        "?callback=" +
        callback;
      document.head.appendChild(script);
    });
  }

  function hasVisited() {
    try {
      return Boolean(window.localStorage.getItem(visitorKey));
    } catch (error) {
      return false;
    }
  }

  function markVisitor() {
    try {
      window.localStorage.setItem(visitorKey, "1");
    } catch (error) {
      // Storage can be disabled; the page counter still works.
    }
  }

  function showCounts(counter, counts) {
    Object.keys(counts).forEach(function (key) {
      var item = counter.querySelector('[data-counter="' + key + '"]');
      if (!item) return;
      item.querySelector(".visit-counter__value").textContent =
        counts[key].toLocaleString(isEnglish ? "en-US" : "zh-CN");
      item.hidden = false;
    });
  }

  function render() {
    var copyright = document.querySelector(".md-copyright");
    if (!copyright || document.getElementById("visit-counter")) return;

    var counter = document.createElement("div");
    counter.id = "visit-counter";
    counter.className = "visit-counter";
    counter.setAttribute("aria-label", isEnglish ? "Website traffic statistics" : "网站访问量统计");
    counter.innerHTML =
      stat("site_pv", labels.sitePv) +
      stat("site_uv", labels.siteUv) +
      stat("page_pv", labels.pagePv);
    copyright.prepend(counter);

    var pagePv = requestCount("hit", "page-" + pageKey());
    var sitePv = requestCount("hit", "site-pv");
    var siteUv = hasVisited()
      ? requestCount("get", "site-uv").catch(function () {
          return requestCount("hit", "site-uv");
        })
      : requestCount("hit", "site-uv").then(function (value) {
          markVisitor();
          return value;
        });

    Promise.all([sitePv, siteUv, pagePv])
      .then(function (values) {
        showCounts(counter, {
          site_pv: values[0],
          site_uv: values[1],
          page_pv: values[2]
        });
      })
      .catch(function () {
        counter.remove();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
