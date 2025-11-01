import { ThemeProvider } from '@components/theme'
import './App.css'
import { Home } from './ui/Home'

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  )
}

export default App
