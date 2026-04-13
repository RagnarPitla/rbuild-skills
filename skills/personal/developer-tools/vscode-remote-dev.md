---
name: vscode-remote-dev
description: "Develop remotely with VS Code using SSH, Dev Containers, and WSL. Use when user says 'VS Code remote SSH', 'dev containers VS Code', 'devcontainer.json setup', 'WSL VS Code', 'develop in Docker VS Code', 'share dev environment team'."
tab: developer-tools
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, vscode, remote-development, containers]
---

# VS Code Remote Development

VS Code's Remote Development extensions let you work inside Docker containers, SSH servers, and WSL environments with the same editor experience you have locally. Your local VS Code UI connects to a remote environment where all code execution, language servers, and extensions run.

## Triggers

- "How do I use VS Code with Remote SSH?"
- "Set up a dev container in VS Code"
- "What is devcontainer.json and how do I configure it?"
- "Develop in WSL using VS Code"
- "How do I share a dev environment with my team?"
- "Connect VS Code to a Docker container"

## How It Works

### The Remote Development Extension Pack

Install the "Remote Development" extension pack from Microsoft. It includes:
- **Remote SSH:** Connect to any SSH-accessible server.
- **Dev Containers:** Develop inside Docker containers.
- **WSL:** Develop in Windows Subsystem for Linux from Windows.
- **Remote Tunnels:** Access VS Code on a machine without SSH using a tunnel.

Install ID: `ms-vscode-remote.vscode-remote-extensionpack`

### Remote SSH

**What it does:** VS Code installs a small server component on the remote host. Your local VS Code connects to it over SSH. The editor UI runs locally; everything else (extensions, file access, terminal, language servers, debugger) runs on the server.

**Setup:**

1. Ensure SSH is configured on the remote host and your `~/.ssh/config` has an entry:
   ```
   Host my-server
     HostName 192.168.1.100
     User ubuntu
     IdentityFile ~/.ssh/id_rsa
   ```

2. Press `F1` and run "Remote-SSH: Connect to Host".

3. Select your host from the list (populated from `~/.ssh/config`) or type `user@hostname`.

4. A new VS Code window opens connected to the remote host. The status bar shows "SSH: my-server" in the bottom left.

5. Open a folder on the remote file system via "File: Open Folder".

**Key behaviors:**
- Extensions you install in this window run on the remote host, not your local machine.
- The integrated terminal opens a shell on the remote server.
- The Explorer panel shows the remote file system.
- Language servers and debuggers execute on the server.

**Forwarding ports:** While connected via SSH, VS Code automatically detects ports the remote server is listening on and offers to forward them locally. Or manually forward: click the "Ports" tab in the bottom panel and click "Forward a Port".

### Dev Containers

**What it does:** VS Code connects to a Docker container as its development environment. Everything runs in the container: extensions, language servers, terminal, debugger, and your code. Your local machine only runs the VS Code UI.

**Prerequisites:** Docker Desktop (Mac/Windows) or Docker Engine (Linux) must be running.

**Setup (existing project):**

1. Open the project folder in VS Code.
2. Press `F1` and run "Dev Containers: Add Dev Container Configuration Files".
3. Choose a template (Node.js, Python, Go, etc.) as a starting point.
4. VS Code creates `.devcontainer/devcontainer.json` (and optionally a `Dockerfile`).
5. Press `F1` and run "Dev Containers: Reopen in Container".

VS Code builds the container image, starts the container, installs the VS Code server inside it, and reconnects. The status bar shows "Dev Container: [name]".

### devcontainer.json Structure

The `devcontainer.json` file defines the container configuration:

```json
{
  "name": "Node.js 22 Dev",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "features": {
    "ghcr.io/devcontainers/features/git:1": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "eamodio.gitlens"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },
  "forwardPorts": [3000, 5432],
  "postCreateCommand": "npm install",
  "remoteUser": "node"
}
```

**Key properties:**

| Property | Purpose |
|---|---|
| `image` | Docker image to use (from Docker Hub or MCR) |
| `build.dockerfile` | Path to a custom Dockerfile to build from |
| `features` | Dev Container Features — pre-built tool installers |
| `customizations.vscode.extensions` | Extensions to install automatically in the container |
| `customizations.vscode.settings` | VS Code settings to apply inside the container |
| `forwardPorts` | Ports to forward from container to localhost |
| `postCreateCommand` | Shell command to run once after container creation |
| `postStartCommand` | Shell command to run each time the container starts |
| `mounts` | Additional volume mounts |
| `remoteUser` | User to run as inside the container |

### .devcontainer Folder Structure

```
.devcontainer/
├── devcontainer.json        # Main config
├── Dockerfile               # Optional: custom image
└── docker-compose.yml       # Optional: multi-container setup
```

For a multi-service project (app + database):

```json
{
  "name": "Full Stack App",
  "dockerComposeFile": ".devcontainer/docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "customizations": {
    "vscode": {
      "extensions": ["ms-python.python", "cweijan.vscode-postgresql-client2"]
    }
  }
}
```

```yaml
# .devcontainer/docker-compose.yml
services:
  app:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
    command: sleep infinity

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: appdb
```

### Rebuild Container Workflow

When you change `devcontainer.json` or the `Dockerfile`, you need to rebuild:

1. Press `F1` and run "Dev Containers: Rebuild Container".
2. VS Code stops the current container, rebuilds the image, and restarts.
3. `postCreateCommand` runs again on a full rebuild (not just restart).

For a complete clean start: "Dev Containers: Rebuild Container Without Cache" rebuilds the Docker image from scratch, ignoring Docker's build cache.

### WSL Development (Windows)

With the WSL extension installed on Windows, VS Code can open a folder inside a WSL distribution directly.

1. Open a WSL terminal.
2. Navigate to your project folder.
3. Run `code .` to open VS Code connected to that WSL path.

Or from VS Code: `F1` then "WSL: Connect to WSL" or "WSL: Open Folder in WSL".

The status bar shows "WSL: Ubuntu" (or whichever distribution is active). Extensions and the terminal run inside WSL.

**Tip:** Store project files inside the WSL file system (e.g., `~/projects/`), not on the Windows drive (`/mnt/c/`). File I/O is significantly faster from WSL's native filesystem.

### Pre-Installing Extensions in Containers

Extensions listed in `customizations.vscode.extensions` are installed automatically every time the container is (re)created. Use extension IDs (find them in the Extension detail panel under the extension name).

To install extensions in the local VS Code that apply to all remote contexts, mark them as "always installed" in VS Code settings:
```json
"remote.extensionKind": {
  "my.extension": ["workspace"]
}
```

Extensions can run either locally (UI) or remotely (workspace). Most code-focused extensions should run in the workspace (container). Theme and keymap extensions should run locally.

### Connecting to an Existing Docker Container

If a container is already running (not started by VS Code), use the Dev Containers extension to attach:

1. Press `F1` and run "Dev Containers: Attach to Running Container".
2. Select the container from the list.

VS Code installs its server component inside the container and connects. Note: this does not use a `devcontainer.json` — settings and extensions are stored in the container itself.

## Quick Reference

### Remote Development Commands (Command Palette)

| Command | Action |
|---|---|
| `Remote-SSH: Connect to Host` | Open SSH connection |
| `Remote-SSH: Open SSH Configuration File` | Edit `~/.ssh/config` |
| `Dev Containers: Reopen in Container` | Open current folder in container |
| `Dev Containers: Rebuild Container` | Rebuild after config changes |
| `Dev Containers: Open Folder in Container` | Open a different folder in a container |
| `Dev Containers: Attach to Running Container` | Connect to existing container |
| `WSL: Connect to WSL` | Open WSL connection (Windows) |
| `Forward a Port` | Manually forward a port in Remote contexts |

### devcontainer.json Quick Config

| Need | Property |
|---|---|
| Use an existing Docker image | `"image": "node:22"` |
| Build a custom image | `"build": { "dockerfile": "Dockerfile" }` |
| Install extensions | `"customizations.vscode.extensions": [...]` |
| Run npm install on create | `"postCreateCommand": "npm install"` |
| Forward a port | `"forwardPorts": [3000]` |
| Add a Dev Container Feature | `"features": { "ghcr.io/devcontainers/features/git:1": {} }` |

## Common Patterns

### Onboard a New Developer in Under 5 Minutes

With a `.devcontainer` folder committed to the repo:

1. Teammate clones the repo.
2. Opens the folder in VS Code.
3. VS Code detects `devcontainer.json` and prompts "Reopen in Container".
4. Click "Reopen in Container". VS Code builds the image, runs `postCreateCommand`, installs the listed extensions.
5. The teammate has an identical environment to everyone else, with no manual setup.

### Develop a Python App Against a Local PostgreSQL Database

`.devcontainer/devcontainer.json`:
```json
{
  "name": "Python + Postgres",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "postCreateCommand": "pip install -r requirements.txt",
  "customizations": {
    "vscode": {
      "extensions": ["ms-python.python", "ms-python.black-formatter"]
    }
  }
}
```

The Postgres service in `docker-compose.yml` is accessible from the app container at `db:5432`.

### Debug a Node.js App Running in a Container

1. Add a `launch.json` with an attach configuration:
   ```json
   {
     "name": "Attach to Container",
     "type": "node",
     "request": "attach",
     "port": 9229,
     "localRoot": "${workspaceFolder}",
     "remoteRoot": "/workspace"
   }
   ```
2. Forward port 9229 in `devcontainer.json`: `"forwardPorts": [9229, 3000]`.
3. Start Node with `--inspect=0.0.0.0:9229` in the container terminal.
4. Press `F5` to attach the debugger.

## Troubleshooting

**VS Code fails to connect to SSH host with "Permission denied".**
Cause: SSH key is not added to the remote host's `authorized_keys`, or the wrong key is being used.
Fix: Run `ssh-copy-id user@hostname` to copy your key. Verify with `ssh user@hostname` in a terminal before using VS Code.

**Dev Container build fails with "Cannot connect to the Docker daemon".**
Cause: Docker Desktop is not running, or the Docker socket is not accessible.
Fix: Start Docker Desktop. On Linux, ensure your user is in the `docker` group: `sudo usermod -aG docker $USER` then log out and back in.

**Extensions installed in the container are not appearing.**
Cause: Extensions are installed per-container. If you rebuilt the container, they need to reinstall.
Fix: Add the extension IDs to `customizations.vscode.extensions` in `devcontainer.json` so they reinstall automatically on rebuild.

**Port forwarding does not work and the app is not accessible from `localhost`.**
Cause: The app is binding to `127.0.0.1` inside the container instead of `0.0.0.0`.
Fix: Configure your app to bind to `0.0.0.0:3000` so VS Code's port forwarding can reach it. Or in VS Code, check the Ports panel and ensure the port is listed and forwarded.

**WSL file operations are slow when files are on the Windows drive.**
Cause: Accessing `/mnt/c/` from WSL crosses the WSL/Windows boundary, which is slow.
Fix: Move the project files into the WSL home directory (`~/projects/`). Clone repos from inside WSL directly.

## Version History

### 1.0.0 (2026-04-13)
- Initial release covering Remote SSH, Dev Containers, WSL, devcontainer.json
- Multi-container setup with docker-compose
- Port forwarding, extension pre-installation, rebuild workflow
- Onboarding pattern for team dev environments
