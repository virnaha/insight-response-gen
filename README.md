# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f220811d-9166-47a8-ab23-908c3d6ad2dd

## Features

This project includes an AI-powered RFP Response Generator that can:

- Generate professional RFP responses using OpenAI's GPT models
- Create content for multiple sections (Executive Summary, Technical Approach, etc.)
- Stream content in real-time as it's being generated
- Support multiple response templates
- Track generation progress and handle errors gracefully

## OpenAI Setup

To use the AI generation features, you'll need to set up your OpenAI API key:

1. **Get an OpenAI API Key**: Visit [OpenAI's API platform](https://platform.openai.com/api-keys) to create an account and get your API key.

2. **Create Environment File**: Create a `.env` file in the project root with the following variables:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4-turbo-preview
VITE_OPENAI_MAX_TOKENS=4000
VITE_OPENAI_TEMPERATURE=7

# Feature Flags
VITE_ENABLE_AI_GENERATION=true
```

3. **Optional Configuration**:
   - `VITE_OPENAI_ORGANIZATION`: Your OpenAI organization ID (if applicable)
   - `VITE_OPENAI_TEMPERATURE`: Controls creativity (0-20, default: 7)
   - `VITE_OPENAI_MAX_TOKENS`: Maximum tokens per response (default: 4000)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f220811d-9166-47a8-ab23-908c3d6ad2dd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f220811d-9166-47a8-ab23-908c3d6ad2dd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
