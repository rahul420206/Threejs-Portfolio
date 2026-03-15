// server.js
import express from 'express';
import cors from 'cors';
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const AZURE_CONNECTION_STRING = "https://synapxrahul123.services.ai.azure.com/api/projects/proj-default";
const AGENT_ID = "asst_nrDyAkL3pQJMw67A2eieWcKA";

// Initialize Client
const projectClient = new AIProjectClient(
  AZURE_CONNECTION_STRING,
  new DefaultAzureCredential()
);

app.post('/api/chat', async (req, res) => {
  const { message, threadId } = req.body;

  try {
    console.log(`User: ${message}`);

    // 1. Create or Reuse Thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await projectClient.agents.threads.create();
      currentThreadId = thread.id;
      console.log(`Created new thread: ${currentThreadId}`);
    }

    // 2. Add User Message
    await projectClient.agents.messages.create(currentThreadId, "user", message);

    // 3. Run the Agent
    let run = await projectClient.agents.runs.create(currentThreadId, AGENT_ID);

// 4. Poll until done
while (run.status === "queued" || run.status === "in_progress") {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased to 1s
    run = await projectClient.agents.runs.get(currentThreadId, run.id);
    console.log(`Current Status: ${run.status}`);
}

// IMPORTANT: Give the Azure database a moment to index the new message
if (run.status === "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1500)); 
}

// 5. Get the latest response
const response = await projectClient.agents.messages.list(currentThreadId);

let messageList = [];

// Azure SDK uses an async iterator for paged results
// We loop through the response to build our message list
for await (const message of response) {
    messageList.push(message);
}

console.log(`Retrieved ${messageList.length} messages from thread.`);

// Find the most recent assistant message
// (The iterator usually returns newest first)
const lastMessage = messageList.find(m => m.role === "assistant");

let responseText = "I'm silent right now.";

if (lastMessage && lastMessage.content) {
    // Look for the text content block
    const textContent = lastMessage.content.find(c => c.type === "text");
    if (textContent && textContent.text) {
        responseText = textContent.text.value;
        console.log(`Agent says: ${responseText}`);
    }
}

res.json({ response: responseText, threadId: currentThreadId });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI Error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`AI Server running on http://localhost:${PORT}`));