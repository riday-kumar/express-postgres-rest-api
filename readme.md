### How to Set Up Express.js with TypeScript

#### npm packages are :

```
npm init -y

npm i -D typescript

npx tsc --init

npm install express

npm i --save-dev @types/express

npm i -D tsx

```

#### now time to edit in **tsconfig.json**

```
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    "rootDir": "./src",
    "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "moduleResolution": "nodenext",

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Recommended Options
    "strict": true,
    // "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### tsup.config.ts
```
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"], // Keep this as ESM
  target: "esnext",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  // Add this banner to shim require() for CJS dependencies
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});

```

#### Now time to edit **package.json** file

```
"scripts": {
    "start": "node dist/server.js",
    "dev": "tsx watch ./src/server.ts",
    "build": "tsc"
  }

------------

"type": "module"
"dev" : "tsx watch ./src/server.ts",
```

### How to deploy vercel

`vercel login`

add vercel config in the app (in the root)

```
vercel.json

{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node",
      "config": { "includeFiles": ["dist/**"] }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}

```

`vercel --prod`


https://first-express-level2.vercel.app/
