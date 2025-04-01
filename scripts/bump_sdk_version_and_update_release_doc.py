import os
import json
import subprocess
import sys
from packaging.version import Version
from datetime import datetime

# Paths to the package.json files
SDK_PATH = './sdk/package.json'
SDK_DIRS = ['./data', './webhooks', './metrics']

# Function to load package.json
def load_package_json(path):
    with open(path, 'r') as f:
        return json.load(f)

# Function to save package.json
def save_package_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

# Compare versions and determine the bump
def compare_versions(sdk_version, sdk_versions, previous_versions):
    """
    Compare the SDK version with the versions from data, webhook, and metrics.
    Bump major if any major is bumped, else bump minor if any minor is bumped,
    else bump patch.
    """
    sdk_ver = Version(sdk_version)

    # Flags to track the highest bump type
    major_bump = False
    minor_bump = False
    patch_bump = False

    for i, ver in enumerate(sdk_versions):
        dep_ver = Version(ver)
        prev_ver = Version(previous_versions[i])

        # Check for version bumps
        if dep_ver.major > prev_ver.major:
            major_bump = True
        elif dep_ver.minor > prev_ver.minor:
            minor_bump = True
        elif dep_ver.micro > prev_ver.micro:
            patch_bump = True

    # Determine the necessary bump
    if major_bump:
        new_version = f"{sdk_ver.major + 1}.0.0"
    elif minor_bump:
        new_version = f"{sdk_ver.major}.{sdk_ver.minor + 1}.0"
    elif patch_bump:
        new_version = f"{sdk_ver.major}.{sdk_ver.minor}.{sdk_ver.micro + 1}"
    else:
        new_version = None

    return new_version


# Collect versions from data, webhooks, and metrics
def get_dependency_versions():
    versions = {}
    for sdk_dir in SDK_DIRS:
        pkg = load_package_json(os.path.join(sdk_dir, 'package.json'))
        versions[pkg['name']] = pkg['version']
    return versions


# Update SDK dependencies with the actual dependency versions
def update_sdk_dependencies(sdk_pkg, dependency_versions):
    """
    Update the SDK dependencies with the versions found in the services.
    """
    for sdk_name, sdk_version in dependency_versions.items():
        if sdk_name in sdk_pkg['dependencies']:
            sdk_pkg['dependencies'][sdk_name] = f"^{sdk_version}"

from datetime import datetime

def update_release_md(new_version, dependency_versions, previous_versions):
    """
    Update or create the RELEASE.md file with the fixed format,
    mentioning the specific SDKs that have changed.
    """
    release_file = './sdk/RELEASE.md'

    # Get the current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Identify which dependencies changed
    changed_sdks = [
        f"- {sdk} bumped from {previous_versions.get(sdk, 'N/A')} to {version}"
        for sdk, version in dependency_versions.items()
        if previous_versions.get(sdk) != version
    ]

    # Create the release content
    release_content = (
        f"## {timestamp}\n\n"
        "### Changes\n\n"
        "Based on:\n"
    )

    # Add the dependency changes or manual trigger message
    if changed_sdks:
        release_content += "\n".join(changed_sdks) + "\n\n"
    else:
        release_content += "- Manually triggered: No dependency changes detected\n\n"

    release_content += (
        "### Generated\n\n"
        f"- [typescript v{new_version}] sdk\n\n"
        "### Releases\n\n"
        f"- [NPM v{new_version}] https://www.npmjs.com/package/@avalanche-sdk/sdk/v/{new_version} - sdk"
    )

    # Append the new release at the top
    if os.path.exists(release_file):
        with open(release_file, 'r+') as f:
            existing_content = f.read()
            f.seek(0)
            f.write(f"{release_content}\n\n---\n\n{existing_content}")
    else:
        with open(release_file, 'w') as f:
            f.write(release_content)

    print(f"Updated RELEASE.md with version {new_version} and dependency changes.")


# Main execution
def main():
    # Get the manual version argument from the GitHub action
    manual_version = sys.argv[1] if len(sys.argv) > 1 else None

    sdk_pkg = load_package_json(SDK_PATH)
    current_sdk_version = sdk_pkg['version']

    # Get previous dependency versions before making changes
    previous_versions = {
        dep: sdk_pkg['dependencies'][dep].lstrip('^')
        for dep in sdk_pkg.get('dependencies', {})
    }

    # Get all dependency versions from services
    latest_dependency_versions = get_dependency_versions()

    common_deps = sorted(set(latest_dependency_versions.keys()) & set(previous_versions.keys()))
    latest_dependency_versions_values = [latest_dependency_versions[key] for key in common_deps]
    previous_versions_values = [previous_versions[key] for key in common_deps]

    if manual_version:
        print(f"Manually setting SDK version to {manual_version}")
        new_version = manual_version
    else:
        # Compare and bump versions automatically if no manual version is provided
        new_version = compare_versions(current_sdk_version, latest_dependency_versions_values, previous_versions_values)

    if new_version:
        print(f"Updating SDK version to {new_version}")
        sdk_pkg['version'] = new_version

        # Update dependencies with the actual versions found in the services
        update_sdk_dependencies(sdk_pkg, latest_dependency_versions)

        save_package_json(SDK_PATH, sdk_pkg)

        # Update or create the release notes
        update_release_md(new_version, latest_dependency_versions, previous_versions)

        # Sync package-lock.json inside /sdk
        print("Running npm install inside /sdk...")
        subprocess.run(['npm', 'install'], cwd='./sdk')

        print(f"Updated RELEASE.md with version {new_version}")
    else:
        print("No version bump required.")

if __name__ == '__main__':
    main()
