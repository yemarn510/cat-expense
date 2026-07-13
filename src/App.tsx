import { AddExpenseDialog } from "./components/dialogs/AddExpenseDialog"
import Nav from "./components/Navbar"


function App() {



  return (
    <main>
      <Nav/>

      <section className="max-w-4xl mx-auto p-10">
        <AddExpenseDialog />        
      </section>
    </main>
  )
}

export default App
