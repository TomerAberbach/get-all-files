import { defineConfig } from 'tsdown/config'

export default defineConfig([
  {
    entry: `src/index.ts`,
    platform: `node`,
    sourcemap: `inline`,
    dts: false,
    publint: true,
  },
  {
    entry: `src/index.ts`,
    dts: { emitDtsOnly: true },
  },
])
