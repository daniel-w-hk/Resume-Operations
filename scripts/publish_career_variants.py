"""Publish the three prepared copies to the user's GitHub account."""

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import argparse
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPOSITORIES = {
    "Resume-Supply-Chain": "Mingkang Wang's supply chain portfolio in English, Traditional Chinese and Simplified Chinese.",
    "Resume-Operations": "Mingkang Wang's operations portfolio in English, Traditional Chinese and Simplified Chinese.",
    "Resume-Business-Analytics": "Mingkang Wang's business analytics portfolio in English, Traditional Chinese and Simplified Chinese.",
}


def run(args, directory, check=True):
    result = subprocess.run(args, cwd=directory, text=True, capture_output=True)
    if check and result.returncode:
        raise RuntimeError(f"{' '.join(args[:4])}: {result.stderr}")
    return result


def publish(name):
    directory = ROOT / "variants" / name
    identity = "daniel-w-hk/" + name
    config = json.loads((directory / "site-variant.json").read_text())
    if config["repository"] != name:
        raise RuntimeError(f"Wrong variant config in {directory}")
    if run(["gh", "repo", "view", identity], directory, check=False).returncode:
        run(["gh", "repo", "create", identity, "--public", "--description", REPOSITORIES[name]], directory)
    run(["git", "remote", "set-url", "origin", "https://github.com/" + identity + ".git"], directory)
    run(["git", "add", "-A"], directory)
    if run(["git", "diff", "--cached", "--quiet"], directory, check=False).returncode:
        run(["git", "commit", "-m", "Add focused three-language portfolio, CV downloads and Excel project"], directory)
    run(["git", "-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential", "push", "-u", "origin", "HEAD:main"], directory)
    page = run(["gh", "api", f"repos/{identity}/pages"], directory, check=False)
    if page.returncode:
        run(["gh", "api", "--method", "POST", f"repos/{identity}/pages", "-f", "build_type=workflow"], directory)
    print("Published https://github.com/" + identity, flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--execute", action="store_true", required=True)
    parser.parse_args()
    with ThreadPoolExecutor(max_workers=3) as executor:
        list(executor.map(publish, REPOSITORIES))
