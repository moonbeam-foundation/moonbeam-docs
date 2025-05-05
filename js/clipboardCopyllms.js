
    document.addEventListener("DOMContentLoaded", () => {
      document
        .querySelector(".full-llms")
        .addEventListener("click", async (event) => {
          try {
            const response = await fetch("https://docs.moonbeam.network/llms-full.txt");
            const text = await response.text();
            await navigator.clipboard.writeText(text);

            const copiedToClipboard = document.querySelector(".md-dialog");
            if (copiedToClipboard) {
              copiedToClipboard.classList.add("md-dialog--active");

              const copiedToClipboardMessage =
                copiedToClipboard.querySelector(".md-dialog__inner");
              if (
                copiedToClipboardMessage &&
                copiedToClipboardMessage.textContent !==
                  "{{ lang.t('clipboard.copied') }}"
              ) {
                copiedToClipboardMessage.textContent =
                  "{{ lang.t('clipboard.copied') }}";
              }
              // Set a timer to remove the after 2 seconds (2000ms)
              setTimeout(() => {
                copiedToClipboard.classList.remove("md-dialog--active");
              }, 2000);
            }
          } catch (err) {
            console.error("Failed to copy:", err);
            copiedToClipboard.classList.remove("md-dialog--active");
          }
        });
    });
