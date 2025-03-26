import os
import re

# File paths
READMES = [
    "data/README.md",
    "metrics/README.md",
    "webhooks/README.md"
]
SDK_README = "sdk/README.md"

# Section markers
OPERATIONS_START = "<!-- Start Available Resources and Operations [operations] -->"
OPERATIONS_END = "<!-- End Available Resources and Operations [operations] -->"

STANDALONE_START = "<!-- Start Standalone functions [standalone-funcs] -->"
STANDALONE_END = "<!-- End Standalone functions [standalone-funcs] -->"


def extract_section(content, start_marker, end_marker):
    """
    Extracts content between two markers from the README content.
    """
    pattern = f"{re.escape(start_marker)}(.*?){re.escape(end_marker)}"
    match = re.search(pattern, content, re.S)
    return match.group(1).strip() if match else ""


def split_common_and_items(section_content, details_tag):
    """
    Splits a section into:
    - `items`: The list items before </details>.
    """
    if details_tag not in section_content:
        return section_content, ""

    # Split at <details> tag to preserve common part
    before, details, after = section_content.partition(details_tag)

    # Extract the content inside <details> before </details>
    details_content = re.search(r"<summary>.*?</summary>\s*(.*?)</details>", after, re.S)
    items = details_content.group(1).strip() if details_content else ""

    return items


def read_sections():
    """
    Reads and merges the specified sections from all SDK readme files.
    """
    operations_items = []
    standalone_items = []
    operations_str = """
## Available Resources and Operations

<details open>
<summary>Available methods</summary> 

{} 

</details>
"""
    standalone_str = """
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

{}

</details>
"""

    for readme in READMES:
        if os.path.exists(readme):
            with open(readme, "r", encoding="utf-8") as f:
                content = f.read()

            # Extract sections
            operations = extract_section(content, OPERATIONS_START, OPERATIONS_END)
            standalone = extract_section(content, STANDALONE_START, STANDALONE_END)

            # Split into common part and items
            if operations:
                ops_items = split_common_and_items(operations, "<details open>")
                if ops_items:
                    operations_items.append(ops_items)

            if standalone:
                standalone_items_list = split_common_and_items(standalone, "<details>")
                if standalone_items_list:
                    standalone_items.append(standalone_items_list)

    # Merge the list items
    merged_operations_items = "\n\n".join(operations_items)
    merged_standalone_items = "\n\n".join(standalone_items)

    # Create the final merged content with common headers preserved
    merged_operations = operations_str.format(merged_operations_items)
    merged_standalone = standalone_str.format(merged_standalone_items)

    return merged_operations, merged_standalone


def update_sdk_readme():
    """
    Updates the sdk/README.md with the merged sections.
    """
    if not os.path.exists(SDK_README):
        print(f"❌ {SDK_README} does not exist.")
        return

    with open(SDK_README, "r", encoding="utf-8") as f:
        content = f.read()

    # Get the merged sections
    merged_operations, merged_standalone = read_sections()

    print("Merged operations:", merged_operations)
    print("Merged standalone functions:", merged_standalone)

    # Use non-greedy regex pattern with multiline support
    operations_pattern = re.compile(
        f"{re.escape(OPERATIONS_START)}(.*?){re.escape(OPERATIONS_END)}",
        flags=re.S
    )
    standalone_pattern = re.compile(
        f"{re.escape(STANDALONE_START)}(.*?){re.escape(STANDALONE_END)}",
        flags=re.S
    )

    # Only insert the merged content, without section markers again
    new_operations = f"{OPERATIONS_START}\n{merged_operations}\n{OPERATIONS_END}"
    new_standalone = f"{STANDALONE_START}\n{merged_standalone}\n{STANDALONE_END}"

    # Perform the replacement
    content = re.sub(operations_pattern, new_operations, content)
    content = re.sub(standalone_pattern, new_standalone, content)

    # Write the updated README
    with open(SDK_README, "w", encoding="utf-8") as f:
        f.write(content)

    print("✅ sdk/README.md updated successfully!")

# Run the script
update_sdk_readme()
