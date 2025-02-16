import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AddTask } from './components/AddTask';
import CustomSidebar from './components/Sidebar';
import { TypeAnimation } from 'react-type-animation';

function App() {
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  const handleSetUserName = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <CustomSidebar
      sidebarOpen={sidebarOpen}
      onSetSidebarOpen={onSetSidebarOpen}
      setUserName={handleSetUserName}
    >
      <>
        <Header onSetSidebarOpen={onSetSidebarOpen} />
        <h2 className="header-title">
          <TypeAnimation
          key={userName}
            sequence={[
              `What are you planning to do, ${userName ? userName : 'User'}?`,
              1000,
              '',
              1000,
              `${getGreeting()}, ${userName ? userName : 'User'}`,
              1000,
              '',
              1000,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{ display: 'inline-block' }}
          />
        </h2>
        <AddTask tasks={tasks} setTasks={setTasks} />
      </>
    </CustomSidebar>
  );
}

export default App;