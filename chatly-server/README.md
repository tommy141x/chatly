## Development Environment Setup for Chatly Server

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
git clone https://github.com/tommy141x/chatly.git && cd chatly/chatly-server
```
## Install dependencies:

After cloning the repository, install the required dependencies using Bun:
```
bun install
```
## Run the development server:
```bash
docker compose up -d
```
