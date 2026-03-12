import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getForm, submitResponse } from '../api/api'

export default function PublicForm() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const res = await getForm(id)
      setForm(res.data)
      const initial = {}
      res.data.fields.forEach(f => {
        initial[f.id] = f.type === 'checkbox' ? [] : ''
      })
      setAnswers(initial)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (fieldId, value) => {
    setAnswers({ ...answers, [fieldId]: value })
  }

  const handleCheckbox = (fieldId, option, checked) => {
    const current = answers[fieldId] || []
    if (checked) {
      handleChange(fieldId, [...current, option])
    } else {
      handleChange(fieldId, current.filter(v => v !== option))
    }
  }

  const handleSubmit = async () => {
    // Validate required fields
    for (const field of form.fields) {
      const val = answers[field.id]
      if (field.required) {
        if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
          return alert(`"${field.label}" is required`)
        }
      }
    }

    setSubmitting(true)
    try {
      const payload = {
        answers: Object.entries(answers).map(([fieldId, value]) => ({ fieldId, value }))
      }
      await submitResponse(id, payload)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <p className="font-mono text-gray-500 text-sm">loading form...</p>
    </div>
  )

  if (!form) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <p className="font-mono text-gray-500 text-sm">Form not found.</p>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="font-serif text-5xl text-white">Thank you.</p>
        <p className="font-mono text-gray-500 text-sm">Your response has been recorded.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark text-white px-6 py-16">
      <div
        className="max-w-2xl mx-auto"
        style={{ textAlign: form.style?.alignment || 'left' }}
      >
        {/* Form Header */}
        <div className="mb-12">
          <h1
            className="font-serif text-5xl text-white mb-4"
            style={{ color: form.style?.primaryColor }}
          >
            {form.title}
          </h1>
          {form.description && (
            <p className="font-mono text-gray-400 text-sm">{form.description}</p>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-8">
          {form.fields.sort((a, b) => a.order - b.order).map((field) => (
            <div key={field.id} className="space-y-3">
              <label className="font-mono text-sm text-white flex items-center gap-2">
                {field.label}
                {field.required && <span style={{ color: form.style?.primaryColor }}>*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={answers[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className="w-full bg-card border border-border px-4 py-3 font-mono text-sm text-white placeholder-gray-700 focus:outline-none"
                  style={{ borderBottomColor: form.style?.primaryColor }}
                  placeholder="Your answer"
                />
              )}

              {field.type === 'dropdown' && (
                <select
                  value={answers[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className="w-full bg-card border border-border px-4 py-3 font-mono text-sm text-white focus:outline-none"
                >
                  <option value="">Select an option</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        checked={answers[field.id] === opt}
                        onChange={e => handleChange(field.id, e.target.value)}
                        className="accent-accent"
                      />
                      <span className="font-mono text-sm text-gray-400 group-hover:text-white transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="space-y-2">
                  {field.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(answers[field.id] || []).includes(opt)}
                        onChange={e => handleCheckbox(field.id, opt, e.target.checked)}
                        className="accent-accent"
                      />
                      <span className="font-mono text-sm text-gray-400 group-hover:text-white transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-12 bg-accent text-black font-mono font-semibold px-8 py-3 hover:opacity-80 transition-opacity disabled:opacity-50 text-sm"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}