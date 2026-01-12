(function () {
  function splitPath(pathname) {
    return (pathname || "/").split("/").filter(Boolean);
  }

  function pathHasLocale(pathname, locale) {
    return splitPath(pathname).indexOf(locale) !== -1;
  }

  function resolveHrefPath(link) {
    var href = link.getAttribute("href") || "";
    try {
      return new URL(href, window.location.href).pathname || "";
    } catch (err) {
      return "";
    }
  }

  function guessDefaultLocale(links, locales) {
    var defaultLocale = "";
    links.forEach(function (link) {
      var lang = link.getAttribute("hreflang") || "";
      var hrefPath = resolveHrefPath(link);
      if (lang && hrefPath && !pathHasLocale(hrefPath, lang) && !defaultLocale) {
        defaultLocale = lang;
      }
    });

    if (!defaultLocale) {
      var htmlLang = document.documentElement.getAttribute("lang") || "";
      if (locales.indexOf(htmlLang) !== -1) {
        defaultLocale = htmlLang;
      }
    }

    return defaultLocale || locales[0] || "";
  }

  function resolveRootPrefixParts(locales, links) {
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var lang = link.getAttribute("hreflang") || "";
      if (!lang) continue;
      var hrefPath = resolveHrefPath(link);
      if (!hrefPath) continue;
      var parts = splitPath(hrefPath);
      var idx = parts.indexOf(lang);
      if (idx !== -1) return parts.slice(0, idx);
    }
    return [];
  }

  function stripPrefixParts(parts, prefixParts) {
    if (!prefixParts.length) return parts.slice();
    for (var i = 0; i < prefixParts.length; i++) {
      if (parts[i] !== prefixParts[i]) return parts.slice();
    }
    return parts.slice(prefixParts.length);
  }

  function resolvePageParts(pathname, rootPrefixParts, locales) {
    var parts = splitPath(pathname);
    parts = stripPrefixParts(parts, rootPrefixParts);
    if (parts.length && locales.indexOf(parts[0]) !== -1) {
      parts = parts.slice(1);
    }
    return parts;
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

  function pickActiveLocale(locales, pathname, fallback) {
    var parts = splitPath(pathname);
    for (var i = 0; i < parts.length; i++) {
      if (locales.indexOf(parts[i]) !== -1) {
        return parts[i];
      }
    }
    return fallback || locales[0] || "";
  }

  function syncLanguageToggle() {
    var pathname = window.location.pathname || "/";
    var languageLinks = document.querySelectorAll(
      '[data-md-component="language"] a[hreflang]'
    );
    var label = document.querySelector(
      '[data-md-component="language"] .language-picker__label'
    );

    if (!languageLinks.length) return;

    var locales = [];
    languageLinks.forEach(function (link) {
      var lang = link.getAttribute("hreflang") || "";
      if (lang && locales.indexOf(lang) === -1) locales.push(lang);
    });

    var defaultLocale = guessDefaultLocale(languageLinks, locales);
    var activeLocale = pickActiveLocale(locales, pathname, defaultLocale);
    var rootPrefixParts = resolveRootPrefixParts(locales, languageLinks);
    var pageParts = resolvePageParts(pathname, rootPrefixParts, locales);
    var trailingSlash = pathname.length > 1 && pathname[pathname.length - 1] === "/";

    languageLinks.forEach(function (link) {
      var lang = link.getAttribute("hreflang") || "";
      if (!lang) return;
      var href = buildHref(rootPrefixParts, lang, defaultLocale, pageParts, trailingSlash);
      link.setAttribute("href", href);
      link.classList.toggle("is-active", lang === activeLocale);
    });

    if (label && activeLocale) {
      label.textContent = activeLocale.toUpperCase();
    }
  }

  document.addEventListener("DOMContentLoaded", syncLanguageToggle);
})();
