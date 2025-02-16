import { useState } from 'react';
import { Header } from './components/Header';
import { AddTask } from './components/AddTask';

function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <>
      <Header />
      <h2 className="header-title">What are you planning to do?</h2>
      <AddTask tasks={tasks} setTasks={setTasks} />
    </>
  );
}

export default App;