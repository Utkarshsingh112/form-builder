import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getForm, getResponses } from '../api/api'

export default function Responses() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        getForm(id),
        getResponses(id)
      ])
      setForm(formRes.data)
      setResponses(responsesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getAnswer = (response, fieldId) => {
    const answer = response.answers.find(a => a.fieldId === fieldId)
    if (!answer) return '-'
    if (Array.isArray(answer.value)) return answer.value.join(', ')
    return answer.value || '-'
  }

  const downloadCSV = () => {
    if (!form || responses.length === 0) return

    const headers = ['Submitted At', ...form.fields.map(f => f.label)]
    const rows = responses.map(r => [
      new Date(r.createdAt).toLocaleString(),
      ...form.fields.map(f => getAnswer(r, f.id))
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title}-responses.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <p className="font-mono text-gray-500 text-sm">loading responses...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark text-white px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <button
              onClick={() => navigate('/')}
              className="font-mono text-xs text-gray-500 hover:text-white transition-colors mb-4 block"
            >
              ← Back
            </button>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Responses</p>
            <h1 className="font-serif text-5xl text-white">{form?.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-gray-500 border border-border px-4 py-2">
              {responses.length} response{responses.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={downloadCSV}
              disabled={responses.length === 0}
              className="bg-accent text-black font-mono text-xs font-semibold px-6 py-2 hover:opacity-80 transition-opacity disabled:opacity-30"
            >
              Download CSV
            </button>
          </div>
        </div>

        {/* Empty state */}
        {responses.length === 0 && (
          <div className="border border-dashed border-border p-24 text-center">
            <p className="font-serif text-4xl text-gray-600 mb-4">No responses yet</p>
            <p className="font-mono text-gray-500 text-sm">Share the form link to start collecting responses</p>
          </div>
        )}

        {/* Table */}
        {responses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="font-mono text-xs text-gray-500 text-left px-4 py-3 uppercase tracking-widest">
                    Submitted At
                  </th>
                  {form?.fields.map(field => (
                    <th key={field.id} className="font-mono text-xs text-gray-500 text-left px-4 py-3 uppercase tracking-widest">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((response, i) => (
                  <tr key={response._id} className={`border-b border-border hover:bg-card transition-colors ${i % 2 === 0 ? 'bg-dark' : 'bg-card'}`}>
                    <td className="font-mono text-xs text-gray-500 px-4 py-4">
                      {new Date(response.createdAt).toLocaleString()}
                    </td>
                    {form?.fields.map(field => (
                      <td key={field.id} className="font-mono text-xs text-white px-4 py-4">
                        {getAnswer(response, field.id)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}