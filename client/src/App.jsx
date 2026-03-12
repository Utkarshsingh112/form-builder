import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import FormBuilder from './pages/FormBuilder'
import PublicForm from './pages/PublicForm'
import Responses from './pages/Responses'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/builder/:id" element={<FormBuilder />} />
      <Route path="/builder/new" element={<FormBuilder />} />
      <Route path="/forms/:id" element={<PublicForm />} />
      <Route path="/responses/:id" element={<Responses />} />
    </Routes>
  )
}

export default App