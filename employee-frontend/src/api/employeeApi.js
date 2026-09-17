const BASE_URL = '/api/employees'

async function handleResponse(res) {
  if (!res.ok) {
    const message = await res.text().catch(() => '')
    throw new Error(message || `Request failed with status ${res.status}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export function getEmployees() {
  return fetch(BASE_URL).then(handleResponse)
}

export function createEmployee(employee) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  }).then(handleResponse)
}

export function updateEmployee(id, employee) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  }).then(handleResponse)
}

export function deleteEmployee(id) {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse)
}
