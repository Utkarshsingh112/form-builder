import axios from 'axios'

const API = axios.create({
  baseURL: ' https://form-builder-2rv4.onrender.com/api'
})

// Forms
export const getForms = () => API.get('/forms')
export const getForm = (id) => API.get(`/forms/${id}`)
export const createForm = (data) => API.post('/forms', data)
export const updateForm = (id, data) => API.put(`/forms/${id}`, data)
export const deleteForm = (id) => API.delete(`/forms/${id}`)
export const duplicateForm = (id) => API.post(`/forms/${id}/duplicate`)

// Responses
export const submitResponse = (formId, data) => API.post(`/forms/${formId}/responses`, data)
export const getResponses = (formId) => API.get(`/forms/${formId}/responses`)