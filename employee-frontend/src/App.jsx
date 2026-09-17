import { useEffect, useState } from 'react'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './api/employeeApi'
import './App.css'

const emptyForm = { name: '', salary: '' }

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)

  useEffect(() => {
    loadEmployees()
  }, [])

  function loadEmployees() {
    setLoading(true)
    setError(null)
    return getEmployees()
      .then(setEmployees)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  function handleAddSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || form.salary === '') return

    setSubmitting(true)
    setError(null)
    createEmployee({ name: form.name.trim(), salary: Number(form.salary) })
      .then((created) => {
        setEmployees((prev) => [...prev, created])
        setForm(emptyForm)
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  function startEdit(employee) {
    setEditingId(employee.id)
    setEditForm({ name: employee.name, salary: employee.salary })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  function handleEditSubmit(e, id) {
    e.preventDefault()
    if (!editForm.name.trim() || editForm.salary === '') return

    setError(null)
    updateEmployee(id, { name: editForm.name.trim(), salary: Number(editForm.salary) })
      .then((updated) => {
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? updated : emp)))
        cancelEdit()
      })
      .catch((err) => setError(err.message))
  }

  function handleDelete(id) {
    setError(null)
    deleteEmployee(id)
      .then(() => setEmployees((prev) => prev.filter((emp) => emp.id !== id)))
      .catch((err) => setError(err.message))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management System</h1>
        <p className="subtitle">Manage your employees</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="card">
        <h2>Add Employee</h2>
        <form className="employee-form" onSubmit={handleAddSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Employee'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Employees</h2>
        {loading ? (
          <p>Loading employees…</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) =>
                editingId === employee.id ? (
                  <tr key={employee.id}>
                    <td colSpan={4}>
                      <form
                        className="edit-form"
                        onSubmit={(e) => handleEditSubmit(e, employee.id)}
                      >
                        <span className="edit-id">#{employee.id}</span>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          required
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.salary}
                          onChange={(e) =>
                            setEditForm({ ...editForm, salary: e.target.value })
                          }
                          required
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.salary}</td>
                    <td className="actions">
                      <button type="button" onClick={() => startEdit(employee)}>
                        Update
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default App
