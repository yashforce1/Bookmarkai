
````markdown
# BookmarkAI

A full-stack bookmark management application with AI-powered features.

## 🚀 Deployment & CI/CD

BookmarkAI is deployed on **AWS EC2** and uses **GitHub Actions** for automated CI/CD.

Every push to the `main` branch automatically triggers the deployment pipeline.

### CI/CD Architecture

```text
Developer
    │
    │ git push origin main
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Build & Test
    │     ├── Checkout code
    │     ├── Setup Node.js
    │     ├── Install dependencies
    │     ├── Run tests
    │     ├── Build backend
    │     └── Build frontend
    │
    │  Build successful
    ▼
Deploy to AWS EC2
    │
    ├── SSH authentication
    ├── Pull latest code
    ├── Install backend dependencies
    ├── Build backend
    ├── Start/Restart backend using PM2
    ├── Install frontend dependencies
    └── Build frontend
    │
    ▼
Running BookmarkAI Application
````

### CI/CD Technology Stack

| Technology     | Purpose                      |
| -------------- | ---------------------------- |
| GitHub         | Source code repository       |
| GitHub Actions | CI/CD automation             |
| AWS EC2        | Application server           |
| SSH            | Secure deployment connection |
| Node.js        | Backend/frontend runtime     |
| npm            | Dependency management        |
| PM2            | Backend process management   |
| MongoDB        | Database                     |
| Nginx          | Web server/reverse proxy     |

### Deployment Trigger

The deployment workflow is triggered automatically whenever code is pushed to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The workflow is defined in:

```text
.github/workflows/deploy.yml
```

---

## 🔄 CI/CD Pipeline

The pipeline consists of two jobs:

```text
Build and Test
      │
      │ SUCCESS
      ▼
Deploy to EC2
```

The deployment job depends on the build-and-test job:

```yaml
needs: build-and-test
```

Therefore, if the build or tests fail, deployment does not proceed.

### 1. Build and Test

GitHub Actions uses a temporary Ubuntu runner:

```yaml
runs-on: ubuntu-latest
```

The repository is checked out using:

```yaml
uses: actions/checkout@v4
```

Node.js is then configured:

```yaml
uses: actions/setup-node@v4
```

The backend runs:

```bash
cd backend
npm ci
npm test --if-present
npm run build
```

The frontend runs:

```bash
cd frontend
npm ci
npm test --if-present
npm run build
```

This verifies that the application can be installed, tested, and built successfully before deployment.

### 2. Deploy to EC2

After the build-and-test stage succeeds, GitHub Actions connects to the AWS EC2 server using SSH through:

```yaml
appleboy/ssh-action@v1.2.2
```

The deployment uses GitHub Repository Secrets:

```text
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

The workflow connects using:

```yaml
with:
  host: ${{ secrets.EC2_HOST }}
  username: ${{ secrets.EC2_USERNAME }}
  key: ${{ secrets.EC2_SSH_KEY }}
```

Once connected, the server executes:

```bash
cd /home/ubuntu/Bookmarkai

git fetch origin main
git checkout main
git pull --ff-only origin main
```

The latest source code is therefore automatically pulled onto EC2.

---

## 🔐 SSH Authentication

A dedicated RSA SSH key was created for GitHub Actions:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github-actions-ec2
```

This generated:

```text
~/.ssh/github-actions-ec2
~/.ssh/github-actions-ec2.pub
```

### Private Key

The private key:

```text
~/.ssh/github-actions-ec2
```

is stored securely in GitHub as:

```text
EC2_SSH_KEY
```

The private key is never committed to the repository.

### Public Key

The public key:

```text
~/.ssh/github-actions-ec2.pub
```

is stored on the EC2 server in:

```text
~/.ssh/authorized_keys
```

The SSH directory permissions were configured using:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Authentication Flow

```text
GitHub Actions
      │
      │ Private SSH Key
      ▼
AWS EC2
      │
      │ Matches public key
      ▼
~/.ssh/authorized_keys
      │
      ▼
SSH Authentication
      │
      ▼
Deployment
```

The SSH connection was manually verified using:

```bash
ssh -i ~/.ssh/github-actions-ec2 \
-o IdentitiesOnly=yes \
ubuntu@3.216.91.87 "echo SSH_SUCCESS"
```

Output:

```text
SSH_SUCCESS
```

This confirmed that the EC2 server, username, and SSH key pair were correctly configured.

---

## 🖥️ Backend Deployment

After connecting to EC2, the workflow enters the backend directory:

```bash
cd backend
```

Dependencies are installed:

```bash
npm ci
```

The backend is built:

```bash
npm run build
```

The backend is managed using PM2.

If the application is already running:

```bash
pm2 restart bookmarkai --update-env
```

Otherwise:

```bash
pm2 start dist/index.js --name bookmarkai --time
```

Finally:

```bash
pm2 save
```

This ensures the backend process remains managed by PM2.

---

## 🌐 Frontend Deployment

The workflow then moves to the frontend:

```bash
cd ../frontend
```

Dependencies are installed:

```bash
npm ci
```

The production build is generated:

```bash
npm run build
```

---

# ⚠️ Deployment Problems Encountered & Solutions

During the CI/CD setup, several problems were encountered.

### 1. EC2 Public IP Changed

The EC2 instance was using a new public IP:

```text
3.216.91.87
```

The GitHub Actions secret:

```text
EC2_HOST
```

was updated to the new IP address.

---

### 2. Private SSH Key Was Not Available

Initially, only SSH key information such as a fingerprint was available.

For example:

```text
RSA
2048 bits
SHA256:...
```

A fingerprint is not a private key and cannot be used by GitHub Actions for SSH authentication.

#### Solution

A new dedicated RSA key was generated:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github-actions-ec2
```

The public key was added to:

```text
~/.ssh/authorized_keys
```

on EC2.

The private key was stored as:

```text
EC2_SSH_KEY
```

in GitHub Secrets.

---

### 3. SSH Authentication Failure

GitHub Actions initially reported:

```text
ssh: handshake failed:
ssh: unable to authenticate,
attempted methods [none publickey],
no supported methods remain
```

However, the same private key successfully connected from the local machine.

This was tested using:

```bash
ssh -i ~/.ssh/github-actions-ec2 \
-o IdentitiesOnly=yes \
ubuntu@3.216.91.87 "echo SSH_SUCCESS"
```

which returned:

```text
SSH_SUCCESS
```

This confirmed that the EC2 server and SSH key pair were working correctly.

The GitHub secret `EC2_SSH_KEY` was then recreated using the complete private key:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

GitHub hides secret values after they are saved. Therefore, reopening the secret and seeing an empty value field is expected behavior.

---

### 4. Unsupported `script_stop` Option

The initial workflow contained:

```yaml
script_stop: true
```

GitHub Actions returned:

```text
Unexpected input(s) 'script_stop'
```

The option was not supported by the configured version of `appleboy/ssh-action`.

#### Solution

The following line was removed:

```yaml
script_stop: true
```

The deployment now uses:

```yaml
with:
  host: ${{ secrets.EC2_HOST }}
  username: ${{ secrets.EC2_USERNAME }}
  key: ${{ secrets.EC2_SSH_KEY }}
  script: |
```

---

### 5. Incorrect Git Remote

The local repository was initially pointing to:

```text
https://github.com/yashforce1/devops-automate.git
```

instead of the actual BookmarkAI repository:

```text
https://github.com/yashforce1/Bookmarkai.git
```

This was identified using:

```bash
git remote -v
```

The remote was corrected using:

```bash
git remote set-url origin https://github.com/yashforce1/Bookmarkai.git
```

It was then verified using:

```bash
git remote -v
```

---

### 6. Node.js Deprecation Warning

GitHub Actions also displayed a warning related to Node.js 20:

```text
Node.js 20 is deprecated
```

This was a warning from the GitHub Actions infrastructure and was **not the cause of the deployment failure**.

The important distinction was:

```text
Build and Test → SUCCESS
Deploy to EC2 → FAILURE
```

The build stage was completing successfully.

---

## 🔒 Security

Sensitive credentials should never be committed to the repository.

Do not commit:

```text
.env
*.pem
private SSH keys
API keys
database passwords
JWT secrets
```

Sensitive deployment information is stored using GitHub Repository Secrets:

```text
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

The workflow accesses them using:

```yaml
${{ secrets.EC2_HOST }}
${{ secrets.EC2_USERNAME }}
${{ secrets.EC2_SSH_KEY }}
```

---

# 🛠️ Stack

* Backend: Node.js, Express, TypeScript, MongoDB
* Frontend: React, TypeScript, Vite
* CI/CD: GitHub Actions
* Cloud: AWS EC2
* Process Manager: PM2
* Web Server: Nginx
* Version Control: Git/GitHub

---

# 📋 Prerequisites

* Node.js v18+
* MongoDB
* npm
* Git

---

# 📦 Installation

## 1. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# ⚙️ Environment Configuration

Create a `.env` file inside the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/bookmarkai
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

Do not commit the `.env` file to GitHub.

---

# 🗄️ Start MongoDB

### Using systemd

```bash
sudo systemctl start mongod
```

### Using Docker

```bash
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  mongo:latest
```

---

# 💻 Development

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

```text
POST /api/v1/signup    User registration
POST /api/v1/signin    User authentication
```

---

# 🏭 Production Build

## Backend

```bash
cd backend
npm run build
npm start
```

## Frontend

```bash
cd frontend
npm run build
npm run preview
```

In production, the backend is managed using PM2.

---

# 📁 Project Structure

```text
BookmarkAI/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── backend/
│   ├── src/
│   ├── dist/
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 🔁 Deployment Workflow Summary

After the CI/CD setup, the deployment process is:

```text
Code Change
     │
     ▼
git add .
     │
     ▼
git commit
     │
     ▼
git push origin main
     │
     ▼
GitHub Actions
     │
     ▼
Build & Test
     │
     ├── Backend npm ci
     ├── Backend tests
     ├── Backend build
     ├── Frontend npm ci
     ├── Frontend tests
     └── Frontend build
     │
     ▼
Deploy to EC2
     │
     ├── SSH authentication
     ├── git pull
     ├── Backend build
     ├── PM2 restart
     └── Frontend build
     │
     ▼
BookmarkAI Updated
```

The main benefit is that future deployments no longer require manually SSHing into EC2, pulling the repository, rebuilding the application, and restarting the backend after every code change.

````

### One important thing before you commit this

Your terminal showed:

```text
origin https://github.com/yashforce1/devops-automate.git
````

while your actual repository is `Bookmarkai`.

So after replacing the README, **verify this before pushing**:

```bash
git remote -v
```

You want:

```text
origin  https://github.com/yashforce1/Bookmarkai.git (fetch)
origin  https://github.com/yashforce1/Bookmarkai.git (push)
```

Then:

```bash
git add README.md
git commit -m "Update README with CI/CD documentation"
git push origin main
```

That push will also trigger your GitHub Actions workflow.
