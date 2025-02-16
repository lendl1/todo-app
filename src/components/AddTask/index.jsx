import { useState, useEffect } from 'react';
import styles from './addtask.module.css';
import { TaskList } from '../TaskList';
import { MdAdd, MdClose } from "react-icons/md";
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';

Modal.setAppElement('#root');

export function AddTask({ tasks, setTasks }) {
  const [task, setTask] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, [setTasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      setIsModalOpen(true);
    } else {
      toast.error('Please enter a task title.');
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.trim() || !taskDescription.trim() || !dueDate) {
      toast.error('All fields must be filled.');
      return;
    }

    if (dueDate < new Date()) {
      toast.error('The selected date and time cannot be in the past.');
      return;
    }

    if (tasks.some(t => t.text === task.trim())) {
      toast.error('Task with the same name already exists.');
      return;
    }

    const newTasks = [...tasks, { text: task, description: taskDescription, dueDate, completed: false }];
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    toast.success(`Task "${task}" was successfully added.`);
    setTask('');
    setTaskDescription('');
    setDueDate(null);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.newTaskContainer}>
      <Toaster position="bottom-right" />
      <form className={styles.newTaskForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.newTaskFormInput}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
          />
          <button type="button" className={styles.addTaskButton} onClick={handleSubmit}>
            <MdAdd className={styles.icon} />
          </button>
        </div>
      </form>
      <TaskList tasks={tasks} setTasks={setTasks} />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Task Details"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
          <MdClose />
        </button>
        <h2 className={styles.modalTitle}>Add New Task</h2>
        <form onSubmit={handleAddTask} className={styles.modalForm}>
          <div className={styles.modalField}>
            <label>Title</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className={styles.modalInput}
            />
          </div>
          <div className={styles.modalField}>
            <label>Description</label>
            <input
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className={styles.modalInput}
            />
          </div>
          <div className={styles.modalField}>
            <label>Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className={styles.modalDatepicker}
              placeholderText="Select a date and time"
            />
          </div>
          <button type="submit" className={styles.modalButton}>Add Task</button>
        </form>
      </Modal>
    </div>
  );
}