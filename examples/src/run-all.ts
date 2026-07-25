import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const demos = ['rest/index.ts', 'graphql/index.ts', 'websocket/index.ts', 'custom/index.ts']

async function run(file: string): Promise<void> {
  console.log(`\n\n########## Running ${file} ##########\n`)
  await new Promise<void>((resolve, reject) => {
    const child = spawn('npx', ['tsx', path.join(root, file)], {
      stdio: 'inherit',
      shell: true,
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${file} exited with ${code}`))
    })
  })
}

async function main() {
  for (const demo of demos) {
    await run(demo)
  }
  console.log('\n\nAll examples completed.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
