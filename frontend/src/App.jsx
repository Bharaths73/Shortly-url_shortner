import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1 className=' text-9xl'>Hello Bharath!</h1>
      <Button>Click Me</Button>
    </div>
  )
}

export default App
