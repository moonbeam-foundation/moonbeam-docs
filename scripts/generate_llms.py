import os
import re

# Moonbeam-specific input
docs_repo = 'moonbeam-docs'
docs_url = 'https://docs.moonbeam.network/'

# Set the base directory to the root of docs
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
docs_dir = os.path.join(base_dir, docs_repo)
output_file = os.path.join(docs_dir, 'llms.txt')
snippet_dir = os.path.join(docs_dir, '.snippets')

# Regex to find lines like: --8<-- 'code/build/applications/...'
SNIPPET_REGEX = r"--8<--\s*['\"]([^'\"]+)['\"]"


def get_all_markdown_files(directory):
    """
    Recursively collect all markdown (.md, .mdx) files from subdirectories of the given directory,
    skipping files directly in the root of docs.
    """
    results = []
    if not os.path.exists(directory):
        print(f"Docs directory not found: {directory}")
        return results

    for root, _, files in os.walk(directory):
        # Skip the root directory
        if root == directory:
            continue

        # Skip '.github'
        if '.github' in root.split(os.sep):
            continue

        for file in files:
            if file.endswith(('.md', '.mdx')):
                results.append(os.path.join(root, file))

     # Sort the files to ensure consistent order
    results.sort()  # Sorting alphabetically
    return results


def build_index_section(files):
    section = "# List of doc pages:\n"

    for file in files:
        relative_path = os.path.relpath(file, docs_dir)

        # Skip .snippets from the index
        if '.snippets' in relative_path.split(os.sep):
            continue

        doc_url_path = re.sub(r'\.(md|mdx)$', '', relative_path)
        doc_url = f"{docs_url}{doc_url_path}"

        # Remove trailing /index from doc_url
        if doc_url.endswith('/index'):
            doc_url = doc_url[:-6]

        section += f"Doc-Page: {doc_url}/\n"
    return section


def parse_line_range(snippet_path):
    """
    Parse snippet paths to extract file and line ranges if available.
    """
    parts = snippet_path.split(':')
    file_only = parts[0]
    line_start = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else None
    line_end = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else None
    return file_only, line_start, line_end


def replace_snippet_placeholders(markdown, snippet_directory):
    def replacement(match):
        snippet_ref = match.group(1)
        file_only, line_start, line_end = parse_line_range(snippet_ref)
        absolute_snippet_path = os.path.join(snippet_directory, file_only)

        if not os.path.exists(absolute_snippet_path):
            print(f"Snippet file not found: {absolute_snippet_path}. Leaving placeholder unchanged.")
            return match.group(0)

        with open(absolute_snippet_path, 'r', encoding='utf-8') as snippet_file:
            snippet_content = snippet_file.read()

        if line_start is not None and line_end is not None:
            lines = snippet_content.split('\n')
            snippet_content = '\n'.join(lines[line_start:line_end])

        return snippet_content.strip()

    return re.sub(SNIPPET_REGEX, replacement, markdown)


def build_content_section(files):
    section = "\n# Full content for each doc page\n\n"

    for file in files:
        relative_path = os.path.relpath(file, docs_dir)

        # Skip printing .snippets individually
        if '.snippets' in relative_path.split(os.sep):
            continue

        doc_url_path = re.sub(r'\.(md|mdx)$', '', relative_path)
        doc_url = f"{docs_url}{doc_url_path}"

        # Remove trailing /index from doc_url
        if doc_url.endswith('/index'):
            doc_url = doc_url[:-6]

        with open(file, 'r', encoding='utf-8') as file_content:
            content = file_content.read()

        # Replace snippet placeholders
        content = replace_snippet_placeholders(content, snippet_dir)

        section += f"Doc-Content: {doc_url}/\n"
        section += "--- BEGIN CONTENT ---\n"
        section += content.strip()
        section += "\n--- END CONTENT ---\n\n"

    return section


def main():
    files = get_all_markdown_files(docs_dir)

    # Header
    llms_content = "# llms.txt\n"
    llms_content += "# Generated automatically. Do not edit directly.\n\n"
    llms_content += f"Documentation: {docs_url}\n\n"

    # Add the index of pages
    llms_content += build_index_section(files)

    # Add the full content
    llms_content += build_content_section(files)

    # Write to llms.txt
    with open(output_file, 'w', encoding='utf-8') as output:
        output.write(llms_content)

    print(f"llms.txt created or updated at: {output_file}")


if __name__ == "__main__":
    main()
