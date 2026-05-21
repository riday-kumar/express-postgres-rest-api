### How to Set Up Express.js with TypeScript

#### Commands are :

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
"rootDir": "./src", // uncomment
"outDir": "./dist", // uncomment
"module": "esnext", // change it ---> 'esnext'

"types": ["node"], // ---> type will be 'node'

"jsx": "react-jsx", // comment this line
```

#### Now time to edit **package.json** file

```
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
