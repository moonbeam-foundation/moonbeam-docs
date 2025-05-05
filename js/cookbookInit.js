
    function initAskCookbook() {
      // It's a public API key, so it's safe to expose it here
      const PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzg3ZmM2YzVhMzY3MzMwYWUxOTQyMGMiLCJpYXQiOjE3MzY5NjUyMjgsImV4cCI6MjA1MjU0MTIyOH0.6MzOf-HmsuuSwtdSvuqvQknRWKUSgt91VJ05sw3OY6I";

      let cookbookContainer = document.getElementById("__cookbook");
      if (!cookbookContainer) {
        cookbookContainer = document.createElement("div");
        cookbookContainer.id = "__cookbook";
        cookbookContainer.dataset.apiKey = PUBLIC_API_KEY;
        document.body.appendChild(cookbookContainer);
      }

      let cookbookScript = document.getElementById("__cookbook-script");
      if (!cookbookScript) {
        cookbookScript = document.createElement("script");
        cookbookScript.id = "__cookbook-script";
        cookbookScript.src = "https://cdn.jsdelivr.net/npm/@cookbookdev/docsbot/dist/standalone/index.cjs.js";
        cookbookScript.async = true;
        document.head.appendChild(cookbookScript);
      }
    }

    // Check if the document is already loaded and if so, initialize the script, otherwise wait for the load event
    if (document.readyState === "complete") {
      initAskCookbook();
    } else {
      window.addEventListener("load", initAskCookbook);
    }