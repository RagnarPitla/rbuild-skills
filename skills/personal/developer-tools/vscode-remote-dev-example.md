# VS Code Remote Development — Example

## Scenario: Standardizing a Python ML Team's Development Environment with Dev Containers

**Who:** Kenji Watanabe, ML Engineer and team lead at a healthcare analytics company. Team of 5 data scientists and engineers working on a Python machine learning pipeline.
**Where:** VS Code, mixed OS team (3 Mac, 1 Windows, 1 Ubuntu), Python 3.11 project with heavy dependencies (PyTorch, pandas, scikit-learn, PostgreSQL client libraries).
**The Problem:** "Works on my machine" is a daily occurrence. One data scientist is on Python 3.10, another on 3.12. CUDA drivers differ. The PostgreSQL client library requires a system-level `libpq` install that nobody documents properly. New team members spend their first two days just getting the environment working. Kenji wants every developer to have an identical, reproducible environment from day one.

**Prerequisites:** VS Code 1.85+, Docker Desktop installed, Dev Containers extension, a Python project repository.

---

### What You Say to the Agent

> "My ML team wastes days on environment setup and 'works on my machine' problems. I want to put a devcontainer.json in our repo so everyone gets the same Python 3.11 environment with all system dependencies pre-installed and the right VS Code extensions ready to go."

### What the Agent Does

1. Creates `.devcontainer/devcontainer.json` using the official `mcr.microsoft.com/devcontainers/python:3.11` base image, which includes Python, pip, and common system libraries.
2. Adds `"features"` entries for `ghcr.io/devcontainers/features/git:1` and `ghcr.io/devcontainers/features/github-cli:1` to ensure Git and GitHub CLI are available in the container.
3. Creates `.devcontainer/Dockerfile` that extends the base image to install `libpq-dev` (PostgreSQL client headers) and CUDA toolkit packages from NVIDIA's apt repository.
4. Sets `"postCreateCommand": "pip install -r requirements.txt"` so dependencies install automatically after the container is created.
5. Lists extensions in `customizations.vscode.extensions`: `ms-python.python`, `ms-python.black-formatter`, `ms-python.pylint`, `ms-toolsai.jupyter`, and `cweijan.vscode-postgresql-client2`.
6. Sets `"forwardPorts": [8888, 5432]` to forward Jupyter notebook and PostgreSQL ports to localhost.
7. Instructs Kenji to commit `.devcontainer/` to the repo. Explains the onboarding flow for teammates: clone, open in VS Code, click "Reopen in Container", wait 3-5 minutes for first build, done.

### The Business Impact

- **Onboarding time cut from 2 days to under 30 minutes:** The container build handles all system dependencies. The `postCreateCommand` installs Python packages. Extensions are pre-configured.
- **Reproducible experiments:** Every team member runs the exact same Python version, library versions, and system libraries. "Works on my machine" becomes "works in the container."
- **Windows developer unblocked:** The Windows team member who previously could not install `libpq` natively now works in the container where it is pre-installed, with no WSL configuration required.

### Try It Yourself

> "I have an existing Docker container running a Node.js app. How do I attach VS Code to it so I can edit the files and use the integrated debugger without restarting the container?"
