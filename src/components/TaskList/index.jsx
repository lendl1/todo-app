import React, { useState, useEffect } from 'react';
import styles from './tasklist.module.css';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import { MdOutlineCircle, MdOutlineCheckCircleOutline, MdModeEdit, MdClose, MdDelete } from "react-icons/md";
import noTaskImage from '../../assets/rest.svg';
import { formatDistanceToNow } from 'date-fns';

Modal.setAppElement('#root');

export function TaskList({ tasks, setTasks }) {
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, [setTasks]);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const handleComplete = (taskToComplete) => {
    const newTasks = tasks.map(task =>
      task === taskToComplete ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };

  const handleEdit = (taskToEdit) => {
    setEditingTask(taskToEdit);
    setEditingText(taskToEdit.text);
    setTaskDescription(taskToEdit.description);
    setDueDate(new Date(taskToEdit.dueDate));
    setIsModalOpen(true);
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const newTasks = tasks.filter(task => task !== taskToDelete);
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
    if (!isToastVisible) {
      setIsToastVisible(true);
      toast.success(`Task "${taskToDelete.text}" was successfully deleted.`, {
        onClose: () => setIsToastVisible(false)
      });
    }
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!editingText.trim() || !taskDescription.trim() || !dueDate) {
      if (!isToastVisible) {
        setIsToastVisible(true);
        toast.error('All fields must be filled.', {
          onClose: () => setIsToastVisible(false)
        });
      }
      return;
    }

    if (dueDate < new Date()) {
      if (!isToastVisible) {
        setIsToastVisible(true);
        toast.error('The selected date and time cannot be in the past.', {
          onClose: () => setIsToastVisible(false)
        });
      }
      return;
    }

    if (tasks.some(t => t !== editingTask && t.text === editingText.trim())) {
      if (!isToastVisible) {
        setIsToastVisible(true);
        toast.error('Task with the same name already exists.', {
          onClose: () => setIsToastVisible(false)
        });
      }
      return;
    }

    const newTasks = tasks.map(task =>
      task === editingTask ? { ...task, text: editingText, description: taskDescription, dueDate } : task
    );
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
    if (!isToastVisible) {
      setIsToastVisible(true);
      toast.success(`Task "${editingText}" was successfully updated.`, {
        onClose: () => setIsToastVisible(false)
      });
    }
    setEditingTask(null);
    setEditingText('');
    setTaskDescription('');
    setDueDate(new Date());
    setIsModalOpen(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

  const completedTasksCount = tasks.filter(task => task.completed).length;

  const prefetchImage = new Image();
  prefetchImage.src = noTaskImage;

  return (
    <div className={styles.container}>
      <Toaster position="bottom-right" />
      <div className={styles.header}>
        <span>Tasks <span className={styles.tasksCount}>{tasks.length}</span></span>
        <span>Completed <span className={styles.completedTasks}>{completedTasksCount} of {tasks.length}</span></span>
      </div>
      {tasks.length === 0 ? (
        <div className={styles.noTasksContainer}>
          <img src={noTaskImage} className={styles.noTasksImage} />
          <p className={styles.noTasksMessage}>No tasks added yet. Start by adding a new task!</p>
        </div>
      ) : (
        <ul className={styles.taskList}>
          {sortedTasks.map((task, index) => (
            <li key={index} className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>
              <button className={styles.completeButton} onClick={() => handleComplete(task)}>
                {task.completed ? <MdOutlineCheckCircleOutline className={`${styles.icon} ${styles.check}`} /> : <MdOutlineCircle className={`${styles.icon} ${styles.circle}`} />}
              </button>
              <span className={styles.taskText}>{task.text}</span>
              <span className={styles.taskDescription}>{task.description}</span>
              <span className={styles.taskDueDate}>Due in {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
              <button onClick={() => handleEdit(task)} className={styles.editButton}>
                <MdModeEdit className={styles.icon} />
              </button>
              <button onClick={() => handleDelete(task)} className={styles.deleteButton}>
                <MdDelete className={styles.icon} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Task"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
          <MdClose />
        </button>
        <h2 className={styles.modalTitle}>Edit Task</h2>
        <form onSubmit={handleSave} className={styles.modalForm}>
          <div className={styles.modalField}>
            <label>Title</label>
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
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
            />
          </div>
          <button type="submit" className={styles.modalButton}>Save Task</button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Task"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button className={styles.closeButton} onClick={() => setIsDeleteModalOpen(false)}>
          <MdClose />
        </button>
        <h2 className={styles.modalTitle}>Delete Task</h2>
        <p>Are you sure you want to delete the task "{taskToDelete?.text}"?</p>
        <div className={styles.modalActions}>
          <button onClick={() => setIsDeleteModalOpen(false)} className={styles.cancelButton}>Cancel</button>
          <button onClick={confirmDelete} className={styles.modalButton}>Yes, Delete</button>
        </div>
      </Modal>
    </div>
  );
}