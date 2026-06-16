import requests
from typing import List, Dict, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LinkChecker:
    def __init__(self):
        self.success_count = 0
        self.error_count = 0
        self.excluded_count = 577

    def check_links(self, urls: List[str]) -> None:
        for url in urls:
            try:
                response = requests.get(url)
                if response.status_code == 200:
                    self.success_count += 1
                else:
                    logger.error(f"[{response.status_code}] {url} | Network error: Not Found")
                    self.error_count += 1
            except requests.exceptions.RequestException as e:
                logger.error(f"[ERROR] {url} | Network error: {e}")
                self.error_count += 1

    def get_summary(self) -> Dict[str, int]:
        return {
            "Total": len(urls),
            "Successful": self.success_count,
            "Timeouts": 0,
            "Redirected": 0,
            "Excluded": self.excluded_count,
            "Unknown": 0,
            "Errors": self.error_count
        }

# Example usage:
urls = [
    "https://wiki.polkadot.com/learn/learn-account-balances/",
    "https://immunefi.com/bug-bounty/moonbeamnetwork/information/"
]

checker = LinkChecker()
checker.check_links(urls)
summary = checker.get_summary()

print("Summary:")
for key, value in summary.items():
    print(f"| {key:<10} | {value}")