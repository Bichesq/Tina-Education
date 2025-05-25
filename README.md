This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


ISSUES
1. When trying to intergrate prisma into the project, in the options.ts file I imported the prisma client:
"import { PrismaClient } from '@prisma/client';
and then
"const prisma = new PrismaClient();"

this gave me the error:
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.

SOLUTION:
After a lot of up and down, I specified the path to the prisma client in the options.ts file:
"import { PrismaClient } from "../../../../generated/prisma";

2. Another error arose: When I now run the app, my landing page shows up well, and when I click on the sign in button, all goes well and the dashboard page shows up, but it does not pull data from the next-auth session. I get the error:
message: "Cannot read properties of undefined (reading 'findUnique')"

2.1 Also, the github and the google sign in buttons do not work. I get the error:
"Try signing in with a different account."

when I sign in with the hardcoded credentials, it results in the error mentioned above: it does not pull data from the next-auth session. 

SOLUTION:
All these were due to the fact that I incorporated the prisma adapter into the next-auth options. I commented out the code:
// adapter: PrismaAdapter(prisma),
and the errors were resolved. I will now try to figure out how to get the prisma adapter to work with next-auth, so that I can use the database to store the user data, but at the same time be able to use the next-auth session.

It turned out that the issue was with missmatch between the database schema and the data sent to create the user. I had to update the database schema to match the data being sent to create the user. I also had to update the next-auth options to use the prisma adapter, and now everything works well - at sign in, the user is created in the database and the session is created with the user data. I can now use the prisma client to query the database and get the user data.

3. I had issues when attempting to submit manuscript data to the database. I was getting the error:
The error TypeError: Cannot read properties of undefined (reading 'create') at prisma.manuscript.create 

SOLUTUION:
Apparently, there was an issue with the prisma client. It turned out the custom output '.generated/prisma' was the issue. I commented out the line of code in the prisma.schema file: and ran the 'npm prisma generate' command. This generated the default output in the node_modules/@prisma/client directory. I then updated the import statement in the prisma.ts file to import the prisma client from the default output directory. it worked well after that. I was able to submit the manuscript data to the database without any issues.