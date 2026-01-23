(function () {
  function splitPath(pathname) {
    return (pathname || "/").split("/").filter(Boolean);
  }

  function stripPrefix(parts, prefixParts) {
    if (!prefixParts.length) return parts.slice();
    for (var i = 0; i < prefixParts.length; i++) {
      if (parts[i] !== prefixParts[i]) return parts.slice();
    }
    return parts.slice(prefixParts.length);
  }

  function trailingSlashFrom(pathname) {
    return pathname === "/" || pathname.endsWith("/");
  }

  function resolveHrefPath(link) {
    var href = link.getAttribute("href") || "";
    try {
      return new URL(href, window.location.href).pathname || "";
    } catch (err) {
      return "";
    }
  }

  function resolveBasePath() {
    var configEl = document.getElementById("__config");
    if (configEl) {
      try {
        var cfg = JSON.parse(configEl.textContent || "{}");
        var base = cfg && cfg.base ? String(cfg.base) : "";
        if (base) {
          var trimmed = base.trim();
          if (trimmed === "." || trimmed === "./") {
            return "";
          }
          return new URL(base, window.location.href).pathname || "";
        }
      } catch (err) {
        // Ignore malformed config and fall back to other heuristics.
      }
    }
    if (typeof __md_scope !== "undefined" && __md_scope && __md_scope.pathname) {
      return __md_scope.pathname;
    }
    return "";
  }

  function resolveBasePrefixParts() {
    var basePath = resolveBasePath();
    if (!basePath) return [];
    return splitPath(basePath);
  }

  function buildHref(rootPrefixParts, lang, defaultLocale, pageParts, trailingSlash) {
    var parts = rootPrefixParts.slice();
    if (lang && lang !== defaultLocale) parts.push(lang);
    parts = parts.concat(pageParts);
    var path = "/" + parts.join("/");
    if (path === "//") path = "/";
    if (path !== "/" && trailingSlash) path += "/";
    return path;
  }

  function findDefaultLocale(links, locales, basePrefixParts) {
    var defaultLocale = locales[0] || "";
    links.forEach(function (link) {
      var lang = link.getAttribute("hreflang") || "";
      if (!lang) return;
      var hrefPath = resolveHrefPath(link);
      if (!hrefPath) return;
      var parts = stripPrefix(splitPath(hrefPath), basePrefixParts);
      if (!parts.length || locales.indexOf(parts[0]) === -1) {
        defaultLocale = lang;
      }
    });

    if (!defaultLocale) {
      var htmlLang = document.documentElement.getAttribute("lang") || "";
      if (locales.indexOf(htmlLang) !== -1) defaultLocale = htmlLang;
    }

    return defaultLocale || locales[0] || "";
  }

  function resolveLocaleAndPage(pathname, basePrefixParts, locales, defaultLocale) {
    var trailingSlash = trailingSlashFrom(pathname);
    var parts = stripPrefix(splitPath(pathname), basePrefixParts);
    var currentLocale = defaultLocale;
    if (parts.length && locales.indexOf(parts[0]) !== -1) {
      currentLocale = parts[0];
      parts = parts.slice(1);
    }
    return { currentLocale: currentLocale, pageParts: parts, trailingSlash: trailingSlash };
  }

  function updateLanguageToggle() {
    var languageLinks = document.querySelectorAll(
      '[data-md-component="language"] a[hreflang]'
    );

    if (!languageLinks.length) return;

    var locales = [];
    languageLinks.forEach(function (link) {
      var lang = link.getAttribute("hreflang") || "";
      if (lang && locales.indexOf(lang) === -1) locales.push(lang);
    });

    var pathname = window.location.pathname || "/";
    var basePrefixParts = resolveBasePrefixParts();
    var defaultLocale = findDefaultLocale(languageLinks, locales, basePrefixParts);
    var resolved = resolveLocaleAndPage(pathname, basePrefixParts, locales, defaultLocale);
    var currentLocale = resolved.currentLocale;
    var pageParts = resolved.pageParts;
    var trailingSlash = resolved.trailingSlash;

    languageLinks.forEach(function (link) {
      var lang = link.getAttribute("hreflang") || "";
      if (!lang) return;
      var nextHref = buildHref(basePrefixParts, lang, defaultLocale, pageParts, trailingSlash);
      link.setAttribute("href", nextHref);
      link.classList.toggle("is-active", lang === currentLocale);
    });

    updateAiLink(basePrefixParts, currentLocale, defaultLocale);
  }

  function updateAiLink(basePrefixParts, currentLocale, defaultLocale) {
    var aiLink = document.querySelector("[data-ai-link]");
    if (!aiLink) return;
    var pathParts = ["ai-resources", "ai-resources"];
    var href = buildHref(
      basePrefixParts,
      currentLocale,
      defaultLocale,
      pathParts,
      true
    );
    aiLink.setAttribute("href", href);
  }

  document.addEventListener("DOMContentLoaded", updateLanguageToggle);
})();
