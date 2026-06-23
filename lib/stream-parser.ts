export async function parseStreamResponse(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No readable stream in response");

  const decoder = new TextDecoder("utf-8");
  let content = "";
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.trim().slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const data = JSON.parse(dataStr);
            // Anthropic format
            if (data.type === 'content_block_delta' && data.delta?.text) {
              content += data.delta.text;
            }
            // OpenAI format
            if (data.choices?.[0]?.delta?.content) {
              content += data.choices[0].delta.content;
            }
          } catch (e) {
            // ignore partial or invalid JSON lines
          }
        }
      }
    }
  }
  return content;
}
