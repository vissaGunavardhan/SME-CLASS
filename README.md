# EmployeeHub — Employee Management System

A responsive employee directory built with plain HTML, CSS, and JavaScript.

## Features
- Dashboard summary showing employee count and departments
- Add, edit, and delete employees
- Search by employee name or ID
- Filter by department
- Browser persistence with `localStorage`
- Optional sample-data API; the app still works when that service is unavailable
- Responsive layout for desktop and mobile
- No build tools or package installation required

## Project files
- `employee.html` — page structure
- `employee.css` — styles and responsive layout
- `employee.js` — employee CRUD, search, filtering, and storage
- `README.md` — project information and setup instructions
- `.gitignore` — common files to exclude from Git

## Run locally
1. Download or clone this repository.
2. Keep all three application files in the same folder.
3. Open `employee.html` in a browser. For the most reliable behavior, use VS Code with the **Live Server** extension and select **Open with Live Server**.
4. Add an employee to test saving, editing, deleting, searching, and department filtering.

Data is stored in the current browser and device. Clearing site data or switching browsers will remove or not show that saved data.

## Publish to GitHub
1. Sign in at https://github.com and create a **new repository** named `employee-management-system`.
2. Choose Public or Private. Do not initialize it with a README if you plan to push this folder as-is.
3. Install Git from https://git-scm.com/downloads if it is not already installed.
4. Open a terminal in this project folder and run:

```bash
git init
git add employee.html employee.css employee.js README.md .gitignore
git commit -m "Fix employee management system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/employee-management-system.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If Git says a remote named `origin` already exists, run `git remote set-url origin https://github.com/YOUR-USERNAME/employee-management-system.git` instead of the `git remote add` command.

## Notes
- This is a front-end demo, not a secure multi-user HR system. `localStorage` data is only available in the current browser.
- The optional external demo API may be rate-limited or unavailable. The app falls back to an empty local directory.
