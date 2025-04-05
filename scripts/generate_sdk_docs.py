import os
import shutil
import re
from pathlib import Path

# Define source and destination mapping
mappings = {
    "devtools/docs": "sdk/docs/",
}

funcs_dst = "sdk/src/funcs/"

# Function to delete old files and folders
def delete_old_doc_files(directory):
    """Deletes all files and folders in the specified directory."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
        print(f"✅ Deleted old files in {directory}")
    os.makedirs(directory, exist_ok=True)

# Function to copy files and preserve the internal folder structure
def copy_and_replace(src, dst, search_text, replace_text):
    """
    Recursively copies files from src to dst, maintaining structure.
    Replaces occurrences of search_text with replace_text in copied files.
    """
    for root, dirs, files in os.walk(src):
        # Create the corresponding destination path
        rel_path = os.path.relpath(root, src)
        
        # Handle SDK folders separately
        if rel_path.startswith("sdks"):
            extract_and_create_func_files(root, files)
        
        # Create target directory
        target_dir = os.path.join(dst, rel_path)

        if len(files) > 0:
            os.makedirs(target_dir, exist_ok=True)

        for file in files:
            src_file = os.path.join(root, file)
            dst_file = os.path.join(target_dir, file)

            # Copy file
            shutil.copy2(src_file, dst_file)

            # Replace text in the copied file
            with open(dst_file, "r", encoding="utf-8") as f:
                content = f.read()

            # Replace occurrences
            updated_content = content.replace(search_text, replace_text)

            with open(dst_file, "w", encoding="utf-8") as f:
                f.write(updated_content)

            print(f"📄 Copied and replaced in: {dst_file}")

def extract_and_create_func_files(root, files):
    """
    Scans files for specific SDK function imports and creates corresponding .ts files in sdk/src/func/.

    Args:
    - root: The root directory being scanned.
    - files: List of files to process.
    """
    # Regex pattern to find SDK imports
    pattern = re.compile(r'@avalanche-sdk/(devtools)/funcs/(\w+)\.js')

    for file in files:
        src_file = os.path.join(root, file)

        # Read the file content
        with open(src_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Find all matching imports
        matches = pattern.findall(content)

        for sdk_type, filename in matches:
            # Create the corresponding .ts file in func_dst
            func_file = os.path.join(funcs_dst, f"{filename}.ts")

            # Add the export statement
            export_statement = f'export * from "@avalanche-sdk/{sdk_type}/funcs/{filename}.js";\n'

            # Write the export statement
            with open(func_file, "w", encoding="utf-8") as f:
                f.write(export_statement)

            print(f"✅ Created {func_file} with export: {export_statement.strip()}")

def copy_file_with_replacements(
    src_path: str,
    dst_path: str,
    replacements: dict[str, str],
    encoding: str = "utf-8",
    default_content: str = ""
) -> None:
    """
    Copy a file from src_path to dst_path using os.path, replacing keys in `replacements` with their values.
    Creates dst_path even if src_path doesn't exist.

    Args:
        src_path (str): Source file path.
        dst_path (str): Destination file path.
        replacements (dict): String replacements {old: new}.
        encoding (str): Encoding for file read/write.
        default_content (str): Content to use if src file doesn't exist.
    """

    # Read or initialize content
    if os.path.exists(src_path):
        with open(src_path, "r", encoding=encoding) as f:
            content = f.read()
        print(f"📄 Reading from: {src_path}")
    else:
        content = default_content
        print(f"⚠️ Source file not found: {src_path}. Creating destination with default content.")

    # Apply replacements
    for old, new in replacements.items():
        content = content.replace(old, new)

    # Make sure destination folder exists
    dst_dir = os.path.dirname(dst_path)
    if dst_dir:
        os.makedirs(dst_dir, exist_ok=True)

    # Write to destination
    with open(dst_path, "w", encoding=encoding) as f:
        f.write(content)

    print(f"✅ File written to {dst_path} with {len(replacements)} replacements.")

# Perform the cleanup, copy, and replace operation for each mapping
search_text = "@avalanche-sdk/devtools"
replace_text = "@avalanche-sdk/sdk"

delete_old_doc_files(funcs_dst)
for src, dst in mappings.items():
    print(f"\n🔥 Deleting old files in {dst}...")
    delete_old_doc_files(dst)
    
    print(f"📂 Copying from {src} to {dst}...")
    copy_and_replace(src, dst, search_text, replace_text)

copy_file_with_replacements(
        src_path="devtools/README.md",
        dst_path="sdk/README.md",
        replacements={
            "@avalanche-sdk/devtools": "@avalanche-sdk/sdk",
            "Devtools": "SDK",
        },
        default_content="# SDK README\n\nGenerated because the source was missing."
    )

print("\n✅ All files copied, old files deleted, and text replaced successfully!")
