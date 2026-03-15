# Environment Setup Instructions

## Required: Ollama Cloud API Key

To use the AI features in this application, you need an Ollama Cloud API key:

1. **Get your API key**:
   - Go to [https://ollama.com/settings/keys](https://ollama.com/settings/keys)
   - Sign up or log in to your Ollama account
   - Generate a new API key
   - Copy the key (it starts with "ollama-")

2. **Create the environment file**:
   ```bash
   cd /home/dev/clinical_trial_form2/new-gen-ui
   touch .env.local
   ```

3. **Add your API key to .env.local**:
   ```env
   OLLAMA_API_KEY=ollama-your_actual_api_key_here
   ```

   **Important**: Replace `ollama-your_actual_api_key_here` with your real API key.

4. **Verify the setup**:
   - Make sure the `.env.local` file is in the project root
   - The file should contain only your API key (one line)
   - The file is automatically ignored by git for security

## Optional: CopilotKit Cloud API

If you want to use CopilotKit's cloud services instead of the local runtime:

1. Get a CopilotKit Cloud API key from [https://cloud.copilotkit.ai](https://cloud.copilotkit.ai)
2. Add it to your `.env.local`:
   ```env
   NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=your_copilot_cloud_key_here
   ```

## Troubleshooting

### AI Features Not Working
- Verify your `.env.local` file exists and contains the correct API key
- Restart the development server after adding the API key: `npm run dev`
- Check the browser console for any API error messages

### API Key Issues
- Make sure the API key is copied correctly (no extra spaces)
- Ensure your Ollama account has sufficient credits
- Check if the API key is valid and not expired

### Development Server Issues
- Stop the server (Ctrl+C)
- Run `npm run dev` again
- Clear browser cache if needed

## Security Notes

- **Never commit your `.env.local` file to version control**
- **Never share your API keys publicly**
- **Keep your API keys secure and private**
- The `.env.local` file is automatically included in `.gitignore`

## Testing the Setup

Once you've set up your API key:

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. The AI chat popup should appear in the bottom-right corner
4. Try asking: "Help me start a new clinical trial"
5. The AI should respond and be able to help navigate the application

If the AI responds and can help you, your setup is working correctly!
