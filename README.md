# Database Subagent

**Database Subagent** is a **full-stack automation tool** that leverages **AI and TypeScript** to add database functionality to existing **Next.js projects**.  
It parses natural language queries, automatically generates **database schemas, migrations, and API routes**, and integrates results into the **frontend UI**, demonstrating skills in **full-stack engineering, AI-assisted development, and database automation**.

---

## Features

- **Natural Language to Database Code**  
  - Parses user queries (e.g., “Store recently played songs in a table”) and generates database logic.
- **Automated Schema Management**  
  - Creates tables, writes migration scripts, and integrates with a relational database via **Drizzle ORM**.
- **API & Frontend Integration**  
  - Generates API endpoints and updates the frontend to display the new data.
- **CLI Workflow**  
  - Provides real-time logs of the agent’s actions, including file edits and migration steps.

---

## Tech Stack

- **TypeScript** / **Node.js** / **Next.js**  
- **Drizzle ORM** for database schema and migrations  
- **OpenAI API** (for natural language processing and code generation)  

---

## Installation

```bash
# Clone the repository
git clone https://github.com/harveyzhu27/database-subagent.git
cd database-subagent

# Install dependencies
npm install

# Optional: Resolve React 19 peer issues
npm install --legacy-peer-deps
