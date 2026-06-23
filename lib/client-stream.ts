export async function consumeStream(
  response: Response,
  onChunk: (text: string) => void
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No readable stream available');

  const decoder = new TextDecoder('utf-8');
  let fullContent = '';
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') continue;
          
          try {
            const data = JSON.parse(dataStr);
            let textDelta = '';
            
            // Anthropic format
            if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
              textDelta = data.delta.text || '';
            }
            // OpenAI format
            else if (data.choices?.[0]?.delta?.content) {
              textDelta = data.choices[0].delta.content;
            }

            if (textDelta) {
              fullContent += textDelta;
              onChunk(fullContent);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  }

  return fullContent;
}
