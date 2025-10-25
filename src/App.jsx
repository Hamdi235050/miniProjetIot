import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Projet IoT</h1>
        <p>Projet React 19 avec Vite</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Compteur: {count}
          </button>
        </div>
      </header>
    </div>
  )
}

export default App
