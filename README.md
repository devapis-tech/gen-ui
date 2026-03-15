# Clinical Trial Forms - AI Powered

A modern clinical trial form management system powered by CopilotKit and Ollama AI, built with Next.js and TypeScript.

## Features

- **AI-Powered Form Assistance**: Intelligent form completion and validation using CopilotKit
- **Multi-Step Workflow**: Guided process from role selection to data export
- **Clinical Trial Data Extraction**: Automatic data extraction from NCT IDs and trial links
- **Dynamic Form Generation**: Adaptive forms based on trial type and user role
- **Export Capabilities**: Multiple export formats (JSON, PDF, CSV)
- **Real-time AI Chat**: Built-in AI assistant for workflow guidance

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **AI Integration**: CopilotKit (React components), Ollama Cloud (LLM)
- **Styling**: Tailwind CSS
- **State Management**: React hooks with CopilotKit integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- Ollama Cloud API key (get one at [https://ollama.com/settings/keys](https://ollama.com/settings/keys))

### Installation

1. Navigate to the project:
```bash
cd /home/dev/clinical_trial_form2/new-gen-ui
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file (this file is git-ignored for security)
# Add your Ollama API key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Ollama Cloud API Key (required)
OLLAMA_API_KEY=your_ollama_api_key_here

# CopilotKit Cloud API Key (optional - for cloud hosting)
# NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=your_copilot_cloud_api_key_here

# Backend API URL (for existing clinical trial API)
VITE_API_URL=http://localhost:5000/api
```

## Workflow Overview

1. **Role Selection**: Choose your role (Internal Team, Organization, Client)
2. **Status Selection**: Indicate if this is a new or ongoing trial
3. **Trial Import**: Import data via NCT ID or trial link (AI-powered extraction)
4. **Form Selection**: Choose required forms for your trial type
5. **Workspace**: Review and edit extracted trial data with AI assistance
6. **Review & Export**: Validate data and export in preferred format

## AI Features

### CopilotKit Integration
- **useCopilotReadable**: Makes app state available to AI
- **useCopilotAction**: Enables AI to perform actions like navigation and data updates
- **CopilotPopup**: Built-in AI chat interface

### Ollama Cloud Integration
- **Data Extraction**: AI-powered parsing of clinical trial information
- **Form Validation**: Intelligent compliance checking
- **Content Generation**: AI-generated summaries and documentation

## Component Structure

```
src/
├── app/
│   ├── api/copilotkit/     # CopilotKit runtime endpoint
│   ├── layout.tsx          # Root layout with CopilotKit provider
│   └── page.tsx            # Main application with workflow
├── components/
│   ├── RoleSelection.tsx   # Role selection interface
│   ├── StatusSelection.tsx # Trial status selection
│   ├── TrialImport.tsx     # Data import with AI extraction
│   ├── FormSelection.tsx   # Form selection interface
│   ├── Workspace.tsx       # Data editing workspace
│   └── ReviewExport.tsx    # Review and export functionality
├── lib/
│   └── ollama.ts           # Ollama cloud client
└── types/
    └── clinical-trial.ts   # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Migration from Old UI

This new implementation provides:
- Modern Next.js architecture vs. Vite + React
- AI-powered assistance vs. manual form filling
- TypeScript for better type safety
- Component-based architecture for maintainability
- Real-time AI chat integration
- Enhanced user experience with Tailwind CSS

## Security Notes

- Environment variables are git-ignored for security
- API keys should never be committed to version control
- Ollama Cloud provides secure API access with token-based authentication
- CopilotKit runtime endpoints should be protected in production

## Contributing

1. Follow the existing component structure
2. Use TypeScript for all new components
3. Maintain consistent styling with Tailwind CSS
4. Add appropriate CopilotKit actions for new features
5. Test AI interactions thoroughly

## License

This project is part of the clinical trial form management system migration.
