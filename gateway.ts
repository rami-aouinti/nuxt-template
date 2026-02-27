import { streamText } from 'ai'
import 'dotenv/config'

function assertGatewaySafety(): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('gateway.ts is disabled in production environments.')
  }

  if (process.env.ENABLE_GATEWAY_DEMO !== 'true') {
    throw new Error(
      'gateway.ts is a local demo script. Set ENABLE_GATEWAY_DEMO=true to run it explicitly.',
    )
  }
}

async function main() {
  assertGatewaySafety()

  const result = streamText({
    model: 'openai/gpt-4.1',
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }

  console.log()
  console.log('Token usage:', await result.usage)
  console.log('Finish reason:', await result.finishReason)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
