import os
import shutil
import re

# Define source and destination mapping
mappings = {
    "data/docs": "sdk/docs/data/",
    "webhooks/docs": "sdk/docs/webhooks/",
    "metrics/docs": "sdk/docs/metrics/",
}

global_sdk_dst = "sdk/docs/sdks/"
global_error_dst = "sdk/docs/errors/"
funcs_dst = "sdk/src/funcs/"

# Function to delete old files and folders
def delete_old_doc_files(directory):
    """Deletes all files and folders in the specified directory."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
        print(f"✅ Deleted old files in {directory}")
    os.makedirs(directory, exist_ok=True)

def create_extra_copy(root, dst_base, rel_path, files, prefix="sdks"):
    """
    Copies the SDK folder docs of the Data, Metrics, and Webhooks SDK to the dst_base.
    Preserves internal folder structure, removing the specified prefix dynamically.

    Args:
    - root: Source directory path.
    - dst_base: Base destination path.
    - rel_path: Relative path of the current directory being copied.
    - files: List of files in the current directory.
    - prefix: The custom prefix to remove (default is "sdks").
    """
    # Remove the custom prefix if it exists
    prefix_with_slash = f"{prefix}/"
    cleaned_rel_path = (
        rel_path[len(prefix_with_slash):] if rel_path.startswith(prefix_with_slash)
        else rel_path[len(prefix):] if rel_path.startswith(prefix)
        else rel_path
    )

    # Construct the final destination path
    dst = os.path.join(dst_base, cleaned_rel_path)
    
    
    os.makedirs(dst, exist_ok=True)

    # Regex pattern to find SDK imports
    pattern = re.compile(r'@avalanche-sdk/(metrics|data|webhooks)')

    for file in files:
        src_file = os.path.join(root, file)
        dst_file = os.path.join(dst, file)

        # Copy file
        shutil.copy2(src_file, dst_file)

        # Replace text in the copied file
        with open(dst_file, "r", encoding="utf-8") as f:
            content = f.read()

        updated_content = content
        matches = pattern.findall(content)
        for sdk_type in matches:
            updated_content = updated_content.replace("avalanche,", f"avalanche.{sdk_type},")

        # Replace occurrences
        updated_content = updated_content.replace("@avalanche-sdk/data", "@avalanche-sdk/sdk")
        updated_content = updated_content.replace("@avalanche-sdk/metrics", "@avalanche-sdk/sdk")
        updated_content = updated_content.replace("@avalanche-sdk/webhooks", "@avalanche-sdk/sdk")

        with open(dst_file, "w", encoding="utf-8") as f:
            f.write(updated_content)

        print(f"📄 Copied and replaced in: {dst_file}")

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
            create_extra_copy(root, global_sdk_dst, rel_path, files, "sdks")
        
        # Handle models/error folders separately
        if rel_path.startswith("models/errors"):
            create_extra_copy(root, global_error_dst, rel_path, files, "models/errors")

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
    pattern = re.compile(r'@avalanche-sdk/(metrics|data|webhooks)/funcs/(\w+)\.js')

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


# Perform the cleanup, copy, and replace operation for each mapping
search_text = "@avalanche-sdk"
replace_text = "@avalanche-sdk/sdk"

delete_old_doc_files(global_sdk_dst)
delete_old_doc_files(global_error_dst)
delete_old_doc_files(funcs_dst)
for src, dst in mappings.items():
    print(f"\n🔥 Deleting old files in {dst}...")
    delete_old_doc_files(dst)
    
    print(f"📂 Copying from {src} to {dst}...")
    copy_and_replace(src, dst, search_text, replace_text)

print("\n✅ All files copied, old files deleted, and text replaced successfully!")
