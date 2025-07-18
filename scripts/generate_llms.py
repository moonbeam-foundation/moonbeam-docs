# generate_llms.py

from generate_llms_standard import generate_standard_llms
from generate_llms_by_category import generate_all_categories

def main():
    # 1) Run the standard generate_llms
    generate_standard_llms()

    # 2) Then run the category-based generation
    generate_all_categories()

if __name__ == "__main__":
    main()