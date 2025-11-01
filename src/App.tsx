import { ThemeProvider } from '@components/theme'
import './App.css'
import { Home } from './ui/Home'

function App() {
  return (
    <ThemeProvider>
      <div className="main">
        <Home />
      </div>
    </ThemeProvider>
  )
}

export default App
