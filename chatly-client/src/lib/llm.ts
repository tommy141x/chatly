import * as webllm from "@mlc-ai/web-llm";

let engine: webllm.MLCEngine;
let isReady = false;

async function initEngine() {
  const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";
  engine = await webllm.CreateMLCEngine(selectedModel);
  isReady = true;
}

async function prompt(text) {
  if (!isReady) return false;
  const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: text },
  ];

  const reply = await engine.chat.completions.create({
    messages,
  });
  return reply.choices[0].message;
  console.log(reply);
}

export { initEngine, prompt };
