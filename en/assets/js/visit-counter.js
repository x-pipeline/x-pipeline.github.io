(function () {
  "use strict";

  var isEnglish = document.documentElement.lang.toLowerCase().indexOf("en") === 0;
  var labels = isEnglish
    ? {
        sitePv: "Total page views",
        siteUv: "Unique visitors",
        pagePv: "Views on this page",
        times: ""
      }
    : {
        sitePv: "本站总访问量",
        siteUv: "本站访客数",
        pagePv: "本页阅读量",
        times: "次"
      };

  function stat(id, label) {
    return (
      '<span id="busuanzi_container_' + id + '" class="visit-counter__item" style="display:none">' +
      label +
      ' <span id="busuanzi_value_' + id + '" class="visit-counter__value"></span>' +
      (labels.times ? " " + labels.times : "") +
      "</span>"
    );
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

    var script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.addEventListener("error", function () {
      counter.remove();
    });
    document.head.appendChild(script);

    window.setTimeout(function () {
      var sitePv = document.getElementById("busuanzi_value_site_pv");
      if (sitePv && !sitePv.textContent.trim()) counter.remove();
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
