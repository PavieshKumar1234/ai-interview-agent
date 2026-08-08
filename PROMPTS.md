# AI Vibe Coding Log — InterviewPro

## Project

**InterviewPro — AI-Powered Interview Platform**

InterviewPro is a full-stack AI-assisted interview platform designed to help candidates complete interviews and receive structured AI-generated feedback, while allowing interviewers to review candidate performance through a dashboard.

---

# 1. Why I Used AI / Vibe Coding

I used AI as a development partner throughout the project instead of building every component manually from scratch.

My workflow was:

1. Define the feature I wanted.
2. Describe the requirement to AI using natural-language prompts.
3. Ask AI to generate or modify the implementation.
4. Copy the generated code into the project.
5. Run the application locally.
6. Inspect errors and unexpected behaviour.
7. Give the error/output back to AI.
8. Ask AI to debug and improve the implementation.
9. Test the feature again.
10. Continue iterating until the feature worked.

This allowed me to move quickly between UI design, frontend integration, API development, debugging, and feature refinement.

The project was developed using a combination of AI-assisted development and manual testing/debugging.

---

# 2. Initial Project Prompt

The initial idea given to AI was approximately:

> "I want to build an AI-powered interview platform with a professional dashboard. Candidates should be able to start an interview, answer questions, complete the interview, and receive an AI-generated evaluation. Interviewers should be able to view candidates and their interview results."

I then refined the requirements through multiple conversations.

---

# 3. Dashboard Design Prompt

I asked AI to help design a professional interview dashboard with separate experiences for candidates and interviewers.

Example prompt:

> "Create a modern professional interview platform dashboard. I need a candidate dashboard and interviewer dashboard. Use a clean enterprise SaaS design with cards, metrics, navigation, interview status, candidate information, and result summaries."

The dashboard was then iteratively refined to include:

- Candidate dashboard
- Interviewer dashboard
- Candidate navigation
- Interview navigation
- Results navigation
- Candidate profile
- Interviewer candidate pipeline
- Analytics
- Settings
- Help center
- Authentication
- Interview result page

---

# 4. Frontend Generation

The frontend was initially prototyped using an AI-assisted UI generation workflow.

The generated frontend was then brought into the local development environment and modified to work with the actual backend API.

Technologies used include:

- React
- TypeScript
- React Router
- Tailwind CSS
- Lucide React
- Axios
- Vite

The AI was used to generate components and help connect the generated UI to the existing application structure.

---

# 5. Authentication Prompt

I asked AI to create a simple authentication flow for the prototype.

Example prompt:

> "Create a React authentication system with candidate and interviewer roles. After login, redirect candidates to the candidate dashboard and interviewers to the interviewer dashboard. Add route protection so users cannot access pages belonging to another role."

This resulted in functionality such as:

- Login page
- Candidate role
- Interviewer role
- Auth state
- Protected routes
- Role-based navigation
- Sign out
- Role-based redirects

---

# 6. Candidate Dashboard

The candidate dashboard was designed to show the candidate's interview progress.

The dashboard contains:

- Welcome message
- Upcoming interview
- Interviewer information
- Interview format
- AI cohort progress
- Previous interview results
- Interview feedback
- Practice interview action

Example prompt:

> "Create a candidate dashboard for an AI interview platform. Show the next interview, interview date, interviewer, AI cohort progress, previous interview results, and links to review feedback or start another interview."

---

# 7. Interviewer Dashboard

The interviewer dashboard was designed as a hiring command center.

It contains:

- Active candidates
- Completed interviews
- Average score
- Time to decision
- Candidate pipeline
- Candidate role
- Candidate score
- Candidate status
- Last activity
- Candidate detail pages

Example prompt:

> "Create an interviewer command center dashboard for an AI interview platform. Show candidate metrics and a candidate pipeline table containing candidate name, role, score, status, and latest activity."

---

# 8. Interview System

The interview page communicates with the backend API.

The frontend sends interview information to the backend and receives the generated interview response.

The frontend uses an API module similar to:

```ts
interviewApi.ts