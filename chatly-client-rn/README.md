## Development Environment Setup for Chatly Client

### This is a react native version of the Chatly Client, using Expo & Tauri.
#### I'm experimenting with this stack to see if it's a good fit for the project.

### Prerequisites

Ensure you have [BunJS](https://bun.sh/) installed on your system.

#### Installing BunJS

#### Windows:
```
powershell -c "irm bun.sh/install.ps1 | iex"
```
#### Linux/macOS::
```
curl -fsSL https://bun.sh/install | bash
```
## Clone the repository:

To contribute to the project, you'll first need to clone the repository:
```
git clone https://github.com/tommy141x/chatly.git && cd chatly/chatly-client-rn
```
## Install dependencies:

After cloning the repository, install the required dependencies using Bun:
```
bun install
```
## Run the development client:

To start the Tauri application in development mode, run:
```
bun run tauri dev
```

You may have to run the command a few times if you encounter any errors.
