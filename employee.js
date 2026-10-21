"use strict";

const DEPARTMENTS = ["IT", "HR", "Finance", "Marketing"];
const STORAGE_KEY = "employeeHub.employees";
let employees = [];
let editingId = null;

const $ = (id) => document.getElementById(id);
const form = $("employee-form");
const employeeList = $("employee-list");

function normalizeEmployee(employee, index) {
  return {
    id: Number(employee.id) || index + 1,
    employee_name: String(employee.employee_name ?? employee.name ?? "Unknown employee"),
    employee_salary: Number(employee.employee_salary ?? employee.salary) || 0,
    employee_age: Number(employee.employee_age ?? employee.age) || 0,
    department: DEPARTMENTS.includes(employee.department)
      ? employee.department
      : DEPARTMENTS[index % DEPARTMENTS.length]
  };
}

function loadEmployees() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error("Saved employee data is not a list.");
      employees = parsed.map(normalizeEmployee);
      renderEmployees();
      return;
    }
  } catch (error) {
    console.warn("Could not read saved employees:", error);
  }

  // The external demo API is optional; the app remains usable if it is unavailable.
  fetch("https://dummy.restapiexample.com/api/v1/employees")
    .then((response) => {
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      return response.json();
    })
    .then((result) => {
      if (localStorage.getItem(STORAGE_KEY) === null && Array.isArray(result.data)) {
        employees = result.data.map(normalizeEmployee);
        saveEmployees();
      }
      renderEmployees();
    })
    .catch((error) => {
      console.warn("Remote employee data unavailable; loading initial sample directory.", error);
      if (localStorage.getItem(STORAGE_KEY) === null) {
        employees = [
          { id: 1, employee_name: "Priya Sharma", employee_salary: 75000, employee_age: 28, department: "IT" },
          { id: 2, employee_name: "Rajesh Kumar", employee_salary: 92000, employee_age: 35, department: "Finance" },
          { id: 3, employee_name: "Ananya Patel", employee_salary: 58000, employee_age: 26, department: "HR" },
          { id: 4, employee_name: "Vikram Singh", employee_salary: 64000, employee_age: 31, department: "Marketing" }
        ].map(normalizeEmployee);
        saveEmployees();
      }
      renderEmployees();
    });
}

function saveEmployees() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return true;
  } catch (error) {
    alert("Could not save data in this browser. Check your browser storage settings.");
    console.error(error);
    return false;
  }
}

function renderEmployees(list = getFilteredEmployees()) {
  $("total").textContent = employees.length;
  $("department-total").textContent = DEPARTMENTS.length;

  if (list.length === 0) {
    employeeList.innerHTML = '<tr><td colspan="6" class="empty-state">No employees found. Add an employee or change your search.</td></tr>';
    return;
  }

  employeeList.replaceChildren();
  list.forEach((employee) => {
    const row = document.createElement("tr");
    [employee.id, employee.employee_name, formatSalary(employee.employee_salary),
      employee.employee_age || "—", employee.department].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actions = document.createElement("td");
    actions.className = "action-cell";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit ${employee.employee_name}`);
    editButton.addEventListener("click", () => editEmployee(employee.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${employee.employee_name}`);
    deleteButton.addEventListener("click", () => deleteEmployee(employee.id));
    actions.append(editButton, deleteButton);
    row.appendChild(actions);
    employeeList.appendChild(row);
  });
}

function formatSalary(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(value);
}

function getFilteredEmployees() {
  const query = $("search").value.trim().toLowerCase();
  const department = $("department-filter").value;
  return employees.filter((employee) => {
    const matchesText = employee.employee_name.toLowerCase().includes(query) ||
      String(employee.id).includes(query);
    return matchesText && (department === "All" || employee.department === department);
  });
}

function showForm(employee = null) {
  editingId = employee ? employee.id : null;
  $("form-title").textContent = employee ? "Edit employee" : "Add employee";
  $("save-button").textContent = employee ? "Update Employee" : "Save Employee";
  $("emp-name").value = employee?.employee_name ?? "";
  $("emp-salary").value = employee?.employee_salary ?? "";
  $("emp-age").value = employee?.employee_age ?? "";
  $("emp-department").value = employee?.department ?? DEPARTMENTS[0];
  $("form-message").textContent = "";
  form.hidden = false;
  $("emp-name").focus();
}

function hideForm() {
  form.hidden = true;
  form.reset();
  editingId = null;
  $("form-message").textContent = "";
}

function editEmployee(id) {
  const employee = employees.find((item) => item.id === id);
  if (employee) showForm(employee);
}

function deleteEmployee(id) {
  const employee = employees.find((item) => item.id === id);
  if (!employee) return;
  if (!confirm(`Delete ${employee.employee_name}? This cannot be undone.`)) return;
  employees = employees.filter((item) => item.id !== id);
  if (saveEmployees()) renderEmployees();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("emp-name").value.trim();
  const salary = Number($("emp-salary").value);
  const age = Number($("emp-age").value);
  const department = $("emp-department").value;

  if (!name || !Number.isFinite(salary) || salary < 0 ||
      !Number.isInteger(age) || age < 18 || age > 100 ||
      !DEPARTMENTS.includes(department)) {
    $("form-message").textContent = "Enter a name, a non-negative salary, an age from 18 to 100, and a valid department.";
    return;
  }

  if (editingId !== null) {
    const employee = employees.find((item) => item.id === editingId);
    if (!employee) return;
    Object.assign(employee, { employee_name: name, employee_salary: salary, employee_age: age, department });
  } else {
    const nextId = employees.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    employees.push({ id: nextId, employee_name: name, employee_salary: salary, employee_age: age, department });
  }

  if (saveEmployees()) {
    hideForm();
    renderEmployees();
  }
});

$("show-form").addEventListener("click", () => showForm());
$("cancel-form").addEventListener("click", hideForm);
$("search").addEventListener("input", () => renderEmployees());
$("department-filter").addEventListener("change", () => renderEmployees());

loadEmployees();
