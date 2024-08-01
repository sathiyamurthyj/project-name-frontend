import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import TaskAddForm from '../components/TaskAddForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import toast from 'react-hot-toast';
import CustomHr from "../components/customHr";
import axiosBaseUrl from "../components/httpcommon";

// fills info on Tasks Tab of Project Details Page.Contains crud operations related to task
function Tasks({project}) {
  const [showModal, setShowModal] = useState(false);
  const [showTaskDescModal, setShowTaskDescModal] = useState(false);
  const [filters, setFilters] = useState({status:"all", assignedTo:"all", assignedBy:"all"});
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const {user} = useSelector(state=>state.users);
  const dispatch = useDispatch();

  const isEmployee = project.members.find(member=>member.role === "employee" && member.user._id===user._id);

  // get all tasks related to user
  const getTasks  = async ()=>{
    try {
      dispatch(SetLoading(true));
      const {data} = await axiosBaseUrl.post("/api/tasks/all-tasks",{project: project._id,...filters},{headers:{authorization: localStorage.getItem("token")}});
      dispatch(SetLoading(false));
      if(data.success){
        setTasks(data.tasks);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  // delete task
  const deleteTask = async(taskId) => {
    try {
      dispatch(SetLoading(true));
      const {data} = await axiosBaseUrl.post("/api/tasks/delete-task",{_id:taskId},{headers:{authorization: localStorage.getItem("token")}});
      if(data.success) {
        getTasks();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      toast.error(error.message);
    }
  };

  // updates the task status based on select options and also send notifications to task creater
  const statusUpdate = async({task, status}) => {
    try {
      dispatch(SetLoading(true));
      const {data} = await axiosBaseUrl.post("/api/tasks/update-task",{_id:task._id,status},{headers:{authorization: localStorage.getItem("token")}});
      if(data.success) {
        getTasks();
        toast.success(data.message);
        axios.post("/api/notifications/add-notification",{
          title: "Task Status Updated",
          description:`${task.taskName} has been updated to ${status}`,
          user: task.assignedBy._id,
          onClick:`/project/${project._id}`
        },{headers:{authorization: localStorage.getItem("token")}});
      } else {
        toast.error(data.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      toast.error(error.message);
    }
  };



  useEffect(()=>{
    getTasks();
  },[]);

  // antd task table columns
  const columns = [
    {
      title: "TaskName",
      dataIndex: "taskName",
      render:(text,record)=><span className='underline cursor-pointer' onClick={()=>{setSelectedTask(record);setShowTaskDescModal(true)}}>
        {record.taskName}
      </span>,
      width:90
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      render:(text,record)=> record.assignedTo.username.toUpperCase(),
      width:90
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      render:(text,record)=> record.assignedBy.username.toUpperCase(),
      ellipsis: true
    },
    {
      title: "Assigned On",
      dataIndex: "createdAt",
      render:(text,record) => new Date(text).toLocaleString('en-in'),
      ellipsis: true
    },
    {
      title: "Status",
      dataIndex: "status",
      render:(text,record)=>{
        return (
          <select value={record.status} onChange={(e)=>statusUpdate({task:record,status:e.target.value})} disabled={record.assignedTo._id !== user._id && isEmployee}>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        )
      },
      ellipsis: true
    },
    {
      title: "Action",
      dataIndex: "action",
      render:(text, record)=>{
        return (
          <div className='flex gap-4'>
            <i 
              className="fa-regular fa-pen-to-square cursor-pointer"
              onClick={()=>{
                setSelectedTask(record);
                setShowModal(true);
                }
              }
              ></i>
            {!isEmployee && <i 
              className="fa-solid fa-trash cursor-pointer"
              onClick={()=>deleteTask(record._id)}
              ></i>}
          </div>
        )
      },
      ellipsis: true
    }
  ];

  if(isEmployee){
    columns.pop();
  }

  useEffect(()=>{
    getTasks();
  },[filters]);

  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-end">
          <Button type='default' onClick={()=>setShowModal(true)}>Add Task</Button>
        </div>
      )}

      <div className="flex gap-5">
        <div>
          <span>Status</span>
          <select 
            value={filters.status}
            onChange={(e)=>setFilters({...filters, status:e.target.value})}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
        </div>
        <div>
          <span>Assigned To</span>
          <select 
            value={filters.assignedTo}
            onChange={(e)=>setFilters({...filters, assignedTo:e.target.value})}>
              <option value="all">All</option>
              {project.members.filter((member)=>member.role==="employee").map((m)=>(
                <option value={m.user._id}>{m.user.username}</option>
              ))}
            </select>
        </div>
        <div>
          <span>Assigned By</span>
          <select 
            value={filters.assignedBy}
            onChange={(e)=>setFilters({...filters, assignedBy:e.target.value})}>
              <option value="all">All</option>
              {project.members.filter((member)=>member.role==="admin"||member.role==="manager").map((m)=>(
                <option value={m.user._id}>{m.user.username}</option>
              ))}
            </select>
        </div>
      </div>

      <Table columns={columns} dataSource={tasks} className='mt-5' />

      {showModal && (
        <TaskAddForm showModal={showModal} setShowModal={setShowModal} project={project} reload={getTasks} selectedTask={selectedTask} />
      )}

      {showTaskDescModal && (
        <Modal
          title="Task Description"
          open={showTaskDescModal}
          onCancel={()=>setShowTaskDescModal(false)}
          centered
          footer={null}
          >
          <div>
            <CustomHr />
            <span className='text-gray-500'>{selectedTask.description}</span>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Tasks;