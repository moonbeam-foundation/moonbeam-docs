import re
import os
import json

# Project-specific input
docs_repo = 'moonbeam-docs'
docs_url = 'https://docs.moonbeam.network/'

# Load configuration from llms_config.json
config_path = os.path.join(os.path.dirname(__file__), 'llms_config.json')
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# Configuration variables
PROJECT_NAME = config["projectName"]
PROJECT_URL = config["projectUrl"]
PROJECT_DESCRIPTION = config["projectDescription"]
SECTION_PRIORITY = config["sectionPriority"]
categories = config["categories"]
AI_PROMPT_TEMPLATE = config["aiPromptTemplate"].format(PROJECT_NAME=PROJECT_NAME, PROJECT_URL=PROJECT_URL)
CORE_CONTEXT_DESCRIPTION = config["coreContextDescription"].format(PROJECT_NAME=PROJECT_NAME)
REFERENCE_CONTEXT_DESCRIPTION = config["referenceContextDescription"].format(PROJECT_NAME=PROJECT_NAME)

# Use raw GitHub links for source URLs
RAW_BASE_URL = f"https://raw.githubusercontent.com/moonbeam-foundation/{docs_repo}/refs/heads/master"


docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) # path to docs directory 
llms_input_path = os.path.join(docs_dir, 'llms-full.txt') # points to the full llms-full.txt
output_dir = os.path.join(docs_dir, 'llms-files')  # path where we store individual category llms files
os.makedirs(output_dir, exist_ok=True) # make the directory if it doesn't exist

# Extracts and writes a per-category LLMS file 
def extract_category(category, shared_data=None): 
    with open(llms_input_path, 'r', encoding='utf-8') as f: # read the full LLMS input file
        llms = f.read() 

    blocks = re.findall(
        r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---", # extract all documentation blocks
        llms, re.DOTALL
    )

    index_lines = [] 
    content_blocks = [] 

    for url, content in blocks: 
        metadata_match = re.search(r"---\n(.*?)\n---", content, re.DOTALL) # extract the metadata block to find categories
        if not metadata_match:
            continue

        metadata = metadata_match.group(1)

        category_line = re.search(r"categories:\s*(.*)", metadata) # looks for a line starting with 'categories:' in the metadata
        if not category_line:
            continue

        def infer_section_label(url): # classify the doc page based on URL path
            for section in SECTION_PRIORITY:
                if f"/{section}/" in url:
                    return section
            return "other"

        # Check if the given category is listed in the metadata
        tags = [tag.strip().lower() for tag in category_line.group(1).split(',')] # splits tags by comma 
        if category.lower() in tags:
            section_label = infer_section_label(url)
            parsed_path = url.replace(docs_url, "").lstrip("/").rstrip("/")
            rel_path = parsed_path + ".md"
            raw_url = f"{RAW_BASE_URL}/{rel_path}"
            index_lines.append(f"Doc-Page: {raw_url} [type: {section_label}]")
            content_blocks.append(f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---") # store full page

    if not content_blocks: # if no pages matched the category, skip 
        print(f"[!] Skipping {category} – no matching pages.")
        return

    # Output file for this category
    output_file = os.path.join(output_dir, f"llms-{category.lower().replace(' ', '-')}.txt") # write to output file
    with open(output_file, 'w', encoding='utf-8') as f:

        # Intro context block to help LLMs understand purpose of the file
        f.write(f"# {PROJECT_NAME} Developer Documentation (LLMS Format)\n\n")
        f.write(f"This file contains documentation for {PROJECT_NAME} ({PROJECT_URL}). {PROJECT_DESCRIPTION}\n")
        f.write(f"It is intended for use with large language models (LLMs) to support developers working with {PROJECT_NAME}. The content includes selected pages from the official docs, organized by section.\n\n")

        # Depending on category, write the correct line
        if category.lower() in ["basics", "reference"]:
            f.write(f"This file includes documentation related to the category: {category}\n\n")
        else:
            f.write(f"This file includes documentation related to the product: {category}\n\n")
            f.write(AI_PROMPT_TEMPLATE)

        def sort_key(pair): # sort the documentation blocks by section priority
            url = pair[0]
            for i, section in enumerate(SECTION_PRIORITY):
                if f"/{section}/" in url:
                    return (i, url)
            return (len(SECTION_PRIORITY), url)  # fallback for anything not matching

        combined = list(zip(index_lines, content_blocks))
        combined.sort(key=sort_key)
        sorted_index_lines, sorted_content_blocks = zip(*combined) if combined else ([], [])

        # Write the index and content blocks
        f.write(f"## List of doc pages:\n")
        f.write('\n'.join(sorted_index_lines))
        f.write("\n\n## Full content for each doc page\n\n")
        f.write('\n\n'.join(sorted_content_blocks))

        # Attach shared core documentation
        if shared_data and category.lower() not in ["basics", "reference"]:
            for label, (context_index, context_content) in shared_data.items():
                context_title = "Basics" if label == "basics" else "Reference"
                context_description = CORE_CONTEXT_DESCRIPTION if label == "basics" else REFERENCE_CONTEXT_DESCRIPTION

                f.write(f"\n\n## {context_title} Concepts [shared: true]\n\n")
                f.write(context_description)
                f.write("\n---\n\n")
                f.write("## List of shared concept pages:\n")
                f.write(context_index + "\n\n")
                f.write("## Full content for shared concepts:\n\n")
                f.write(context_content)
    print(f"[✓] Generated {output_file} with {len(content_blocks)} pages")

# Generate LLMS files for all categories including shared core content.
def generate_all_categories():
   
    shared_data = {}

    for shared in ['Basics', 'Reference']:
        extract_category(shared)  # Generate the file
        path = os.path.join(output_dir, f"llms-{shared.lower()}.txt")
        with open(path, 'r', encoding='utf-8') as f:
            raw = f.read()

        index_match = re.search(r"# List of doc pages:\n(.*?)\n\n# Full content", raw, re.DOTALL)
        index = index_match.group(1).strip() if index_match else ""

        blocks = re.findall(
            r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---",
            raw, re.DOTALL
        )

        content = ""
        for url, block in blocks:
            content += f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{block.strip()}\n--- END CONTENT ---\n\n"

        shared_data[shared.lower()] = (index, content.strip())

    # Generate each category file
    for cat in categories:
        extract_category(cat, shared_data)

# Only run this if script is executed directly
if __name__ == "__main__":
    generate_all_categories()

