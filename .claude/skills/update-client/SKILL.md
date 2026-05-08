---
description: Check for the latest Moonbeam client release, update version tags and sha256sum in variables.yml
---

Follow these steps exactly:

1. **Get the latest client release from GitHub.**
   Fetch the releases list and filter out runtime releases (tags starting with `runtime-`). Client releases are semver tags like `v0.51.2`.
   ```
   curl -s https://api.github.com/repos/moonbeam-foundation/moonbeam/releases | python3 -c "
   import sys, json
   releases = json.load(sys.stdin)
   client = [r for r in releases if not r['tag_name'].startswith('runtime-') and not r['prerelease']]
   print(client[0]['tag_name'])
   "
   ```
   Strip the leading `v` to get the version number (e.g., `0.51.2`). Call this `NEW_VERSION`.

2. **Get the latest tracing tag from Docker Hub.**
   Fetch the tag list and find the tag that starts with `v{NEW_VERSION}-` and does NOT end with `-latest` (i.e., it ends with a short git hash):
   ```
   curl -s "https://hub.docker.com/v2/repositories/moonbeamfoundation/moonbeam-tracing/tags?page_size=100" | python3 -c "
   import sys, json
   data = json.load(sys.stdin)
   tags = [t['name'] for t in data['results']
           if t['name'].startswith('v{NEW_VERSION}-') and not t['name'].endswith('-latest')]
   print(tags[0] if tags else 'NOT FOUND')
   "
   ```
   The full tracing tag value to store is `moonbeamfoundation/moonbeam-tracing:{tag}`. Call this `NEW_TRACING_TAG`.

3. **Compare with current values in `variables.yml`.**
   Read the current `parachain_release_tag` under `networks.moonbeam`. If it already matches `NEW_VERSION`, stop and report that variables.yml is already up to date.

4. **Download the binary and compute sha256sum.**
   ```
   curl -sL https://github.com/moonbeam-foundation/moonbeam/releases/download/v{NEW_VERSION}/moonbeam -o /tmp/moonbeam-checksum-binary
   shasum -a 256 /tmp/moonbeam-checksum-binary
   ```
   Extract just the hash (first field). Call this `NEW_SHA256`.

5. **Update `variables.yml`** using the Edit tool. Replace all occurrences of the old values with the new ones:
   - `development.build_tag` → `NEW_VERSION`
   - All `parachain_release_tag` fields (moonbase, moonriver, moonbeam) → `NEW_VERSION`
   - All `tracing_tag` fields (development, moonbase, moonriver, moonbeam) → `NEW_TRACING_TAG`
   - All `parachain_sha256sum` fields (moonbase, moonriver, moonbeam) → `NEW_SHA256`

6. **Clean up.**
   ```
   rm /tmp/moonbeam-checksum-binary
   ```

7. **Report** the old version, new version, new tracing tag, and new sha256sum.
