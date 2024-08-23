import * as webllm from "@mlc-ai/web-llm";

let engine: webllm.MLCEngine;
let isReady = false;

async function initEngine() {
  if (isReady) return;
  const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";
  engine = await webllm.CreateMLCEngine(selectedModel);
  isReady = true;
}

async function prompt(text: string): Promise<string | false> {
  if (!isReady) return false;

  const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: text },
  ];

  const reply = await engine.chat.completions.create({
    messages,
  });

  console.log(reply);
  return reply.choices[0].message.content;
}

export { initEngine, prompt };
