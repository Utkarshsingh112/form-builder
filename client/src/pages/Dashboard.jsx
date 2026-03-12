import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getForms, deleteForm, duplicateForm } from '../api/api'

export default function Dashboard() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const res = await getForms()
      setForms(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this form?')) return
    await deleteForm(id)
    fetchForms()
  }

  const handleDuplicate = async (id) => {
    await duplicateForm(id)
    fetchForms()
  }

  return (
    <div className="min-h-screen bg-dark text-white px-8 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-accent font-mono text-sm tracking-widest uppercase mb-2">Form Builder</p>
          <h1 className="font-serif text-6xl text-white">Your Forms</h1>
        </div>
        <button
          onClick={() => navigate('/builder/new')}
          className="bg-accent text-black font-mono font-semibold px-6 py-3 hover:bg-white transition-colors duration-200 text-sm tracking-wide"
        >
          + New Form
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 font-mono mt-32">loading forms...</div>
      )}

      {/* Empty state */}
      {!loading && forms.length === 0 && (
        <div className="border border-dashed border-border rounded-none p-24 text-center">
          <p className="font-serif text-4xl text-gray-600 mb-4">No forms yet</p>
          <p className="font-mono text-gray-500 text-sm">Create your first form to get started</p>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-card border border-border p-6 hover:border-accent transition-colors duration-200 group"
          >
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-white mb-2 group-hover:text-accent transition-colors duration-200">
                {form.title}
              </h2>
              <p className="font-mono text-gray-500 text-xs line-clamp-2">
                {form.description || 'No description'}
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-gray-600 bg-dark px-3 py-1 border border-border">
                {form.fields.length} fields
              </span>
              <span className="font-mono text-xs text-gray-600">
                {new Date(form.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate(`/builder/${form._id}`)}
                className="font-mono text-xs py-2 border border-border hover:border-accent hover:text-accent transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/forms/${form._id}`)}
                className="font-mono text-xs py-2 border border-border hover:border-accent hover:text-accent transition-colors duration-200"
              >
                View
              </button>
              <button
                onClick={() => navigate(`/responses/${form._id}`)}
                className="font-mono text-xs py-2 border border-border hover:border-accent hover:text-accent transition-colors duration-200"
              >
                Responses
              </button>
              <button
                onClick={() => handleDuplicate(form._id)}
                className="font-mono text-xs py-2 border border-border hover:border-accent hover:text-accent transition-colors duration-200"
              >
                Duplicate
              </button>
            </div>

            <button
              onClick={() => handleDelete(form._id)}
              className="w-full mt-2 font-mono text-xs py-2 border border-border hover:border-red-500 hover:text-red-500 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}