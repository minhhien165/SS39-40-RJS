// TodoList.tsx
import React, { useState, useEffect } from 'react';

export default function TodoList() {
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState<{ name: string; completed: boolean }[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<{ name: string; index: number } | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setShowErrorModal(true);
      return;
    }
    if (editingTask) {
      // Nếu đang chỉnh sửa, cập nhật công việc
      const updatedTasks = [...tasks];
      updatedTasks[editingTask.index] = { name: taskName.trim(), completed: false };
      setTasks(updatedTasks);
      setEditingTask(null);
    } else {
      // Nếu không đang chỉnh sửa, thêm công việc mới
      setTasks([...tasks, { name: taskName.trim(), completed: false }]);
    }
    setTaskName('');
  };

  const handleDeleteTask = (taskName: string) => {
    setTaskToDelete(taskName);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.name !== taskToDelete));
      setTaskToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleToggleTask = (taskName: string) => {
    setTasks(tasks.map(task =>
      task.name === taskName ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEditTask = (taskName: string, index: number) => {
    setEditingTask({ name: taskName, index });
    setTaskName(taskName);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'uncompleted') return !task.completed;
    return true;
  });

  return (
    <div className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="card-body p-5">
                <form
                  className="d-flex justify-content-center align-items-center mb-4"
                  onSubmit={handleAddTask}
                >
                  <div className="form-outline flex-fill">
                    <input
                      type="text"
                      id="form2"
                      className="form-control"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                    <label className={`form-label ${taskName ? 'active' : ''}`} htmlFor="form2">
                      Nhập tên công việc
                    </label>
                  </div>
                  <button type="submit" className="btn btn-info ms-2">
                    {editingTask ? 'Cập nhật' : 'Thêm'}
                  </button>
                </form>

                <ul className="nav nav-tabs mb-4 pb-2">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                      Tất cả
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
                      Đã hoàn thành
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${filter === 'uncompleted' ? 'active' : ''}`} onClick={() => setFilter('uncompleted')}>
                      Chưa hoàn thành
                    </button>
                  </li>
                </ul>

                <div className="tab-content" id="ex1-content">
                  <div className="tab-pane fade show active">
                    <ul className="list-group mb-0">
                      {filteredTasks.map((task, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                          style={{ backgroundColor: '#f4f6f7' }}
                        >
                          <div>
                            <input
                              className="form-check-input me-2"
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(task.name)}
                            />
                            {task.completed ? <s>{task.name}</s> : <span>{task.name}</span>}
                          </div>
                          <div className="d-flex gap-3">
                            <i className="fas fa-pen-to-square text-warning" onClick={() => handleEditTask(task.name, index)}></i>
                            <i
                              className="far fa-trash-can text-danger"
                              onClick={() => handleDeleteTask(task.name)}
                            ></i>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i className="fas fa-xmark" onClick={() => setShowDeleteModal(false)}></i>
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa công việc {taskToDelete}?</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={() => setShowDeleteModal(false)}>Hủy</button>
              <button className="btn btn-danger" onClick={confirmDeleteTask}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i className="fas fa-xmark" onClick={() => setShowErrorModal(false)}></i>
            </div>
            <div className="modal-body-custom">
              <p>Tên công việc không được phép để trống.</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={() => setShowErrorModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
