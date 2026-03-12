import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getForm, createForm, updateForm } from '../api/api'
import { v4 as uuidv4 } from 'uuid'

export default function FormBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState([])
  const [style, setStyle] = useState({
    primaryColor: '#e8d5b7',
    fontFamily: 'DM Mono',
    alignment: 'left'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const res = await getForm(id)
      setTitle(res.data.title)
      setDescription(res.data.description)
      setFields(res.data.fields)
      setStyle(res.data.style)
    } catch (err) {
      console.error(err)
    }
  }

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: '',
      options: type === 'text' ? [] : ['Option 1'],
      required: false,
      order: fields.length
    }
    setFields([...fields, newField])
  }

  const updateField = (fieldId, key, value) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f))
  }

  const removeField = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId))
  }

  const moveField = (index, direction) => {
    const newFields = [...fields]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newFields.length) return
    ;[newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]]
    setFields(newFields)
  }

  const addOption = (fieldId) => {
    const field = fields.find(f => f.id === fieldId)
    updateField(fieldId, 'options', [...field.options, `Option ${field.options.length + 1}`])
  }

  const updateOption = (fieldId, optIndex, value) => {
    const field = fields.find(f => f.id === fieldId)
    const newOptions = [...field.options]
    newOptions[optIndex] = value
    updateField(fieldId, 'options', newOptions)
  }

  const removeOption = (fieldId, optIndex) => {
    const field = fields.find(f => f.id === fieldId)
    updateField(fieldId, 'options', field.options.filter((_, i) => i !== optIndex))
  }

  const handleSave = async () => {
    if (!title.trim()) return alert('Form title is required')
    setSaving(true)
    try {
      const payload = { title, description, fields, style }
      if (isNew) {
        await createForm(payload)
      } else {
        await updateForm(id, payload)
      }
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Top Bar */}
      <div className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-dark z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="font-mono text-xs text-gray-500 hover:text-white transition-colors">
            ← Back
          </button>
          <span className="font-mono text-xs text-gray-600">|</span>
          <span className="font-mono text-xs text-gray-500">{isNew ? 'New Form' : 'Edit Form'}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-black font-mono text-xs font-semibold px-6 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-3 gap-8">
        {/* Left — Form Details + Fields */}
        <div className="col-span-2 space-y-6">
          {/* Form Info */}
          <div className="bg-card border border-border p-6 space-y-4">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Form Details</p>
            <input
              type="text"
              placeholder="Form Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-dark border border-border px-4 py-3 font-serif text-2xl text-white placeholder-gray-700 focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-dark border border-border px-4 py-3 font-mono text-sm text-white placeholder-gray-700 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Fields */}
          {fields.length === 0 && (
            <div className="border border-dashed border-border p-16 text-center">
              <p className="font-mono text-gray-600 text-sm">No fields yet. Add one from the right panel.</p>
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="bg-card border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">{field.type}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveField(index, 'up')} className="font-mono text-xs text-gray-600 hover:text-white px-2 py-1 border border-border hover:border-gray-500">↑</button>
                  <button onClick={() => moveField(index, 'down')} className="font-mono text-xs text-gray-600 hover:text-white px-2 py-1 border border-border hover:border-gray-500">↓</button>
                  <button onClick={() => removeField(field.id)} className="font-mono text-xs text-gray-600 hover:text-red-500 px-2 py-1 border border-border hover:border-red-500">✕</button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Field label"
                value={field.label}
                onChange={e => updateField(field.id, 'label', e.target.value)}
                className="w-full bg-dark border border-border px-4 py-2 font-mono text-sm text-white placeholder-gray-700 focus:outline-none focus:border-accent"
              />

              {/* Options for dropdown/radio/checkbox */}
              {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
                <div className="space-y-2">
                  <p className="font-mono text-xs text-gray-600">Options</p>
                  {field.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(field.id, optIndex, e.target.value)}
                        className="flex-1 bg-dark border border-border px-3 py-2 font-mono text-xs text-white placeholder-gray-700 focus:outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => removeOption(field.id, optIndex)}
                        className="font-mono text-xs text-gray-600 hover:text-red-500 px-3 py-2 border border-border hover:border-red-500"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(field.id)}
                    className="font-mono text-xs text-gray-500 hover:text-white border border-dashed border-border hover:border-gray-500 px-4 py-2 w-full transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={e => updateField(field.id, 'required', e.target.checked)}
                  className="accent-accent"
                />
                <span className="font-mono text-xs text-gray-500">Required field</span>
              </label>
            </div>
          ))}
        </div>

        {/* Right Panel — Add Fields + Styling */}
        <div className="space-y-6">
          {/* Add Fields */}
          <div className="bg-card border border-border p-6 space-y-3">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Add Field</p>
            {['text', 'dropdown', 'radio', 'checkbox'].map(type => (
              <button
                key={type}
                onClick={() => addField(type)}
                className="w-full font-mono text-xs py-3 border border-border hover:border-accent hover:text-accent transition-colors duration-200 capitalize"
              >
                + {type}
              </button>
            ))}
          </div>

          {/* Styling */}
          <div className="bg-card border border-border p-6 space-y-4">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Styling</p>

            <div className="space-y-2">
              <p className="font-mono text-xs text-gray-600">Accent Color</p>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={style.primaryColor}
                  onChange={e => setStyle({ ...style, primaryColor: e.target.value })}
                  className="w-10 h-10 border border-border bg-dark cursor-pointer"
                />
                <span className="font-mono text-xs text-gray-500">{style.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-xs text-gray-600">Font</p>
              <select
                value={style.fontFamily}
                onChange={e => setStyle({ ...style, fontFamily: e.target.value })}
                className="w-full bg-dark border border-border px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-accent"
              >
                <option>DM Mono</option>
                <option>DM Serif Display</option>
                <option>Georgia</option>
                <option>Courier New</option>
              </select>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-xs text-gray-600">Alignment</p>
              <div className="grid grid-cols-2 gap-2">
                {['left', 'center'].map(align => (
                  <button
                    key={align}
                    onClick={() => setStyle({ ...style, alignment: align })}
                    className={`font-mono text-xs py-2 border transition-colors duration-200 capitalize ${style.alignment === align ? 'border-accent text-accent' : 'border-border text-gray-500 hover:border-gray-500'}`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}