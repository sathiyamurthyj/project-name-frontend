import { Form, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';

// Antd form and Modal for adding Tasks
function TaskAddForm({showModal, setShowModal, project, selectedTask, reload}) {
  const [email, setEmail] = useState(""); 
  const modalOk = useRef(null);
  const {user} = useSelector(state=>state.users);
  const dispatch = useDispatch();

  const onFinish = async (values)=>{
    try {
       let response = null;
       const assignedToMember = project.members.find(member=>member.user.email === email);
       const assignedtoUserId = assignedToMember.user._id;
       dispatch(SetLoading(true));
       if(selectedTask){
        // update task
        response = await axios.post("/api/tasks/update-task",{...values,project:project._id,_id:selectedTask._id, assignedTo: selectedTask.assignedTo._id},{headers:{authorization: localStorage.getItem("token")}});
       } else{
            // const assignedToMember = project.members.find(member=>member.user.email === email);
            // const assignedtoUserId = assignedToMember.user._id;
            const assignedBy = user._id;
            response = await axios.post("/api/tasks/create-task",{...values,project:project._id,assignedTo:assignedtoUserId,assignedBy},{headers:{authorization: localStorage.getItem("token")}});
       };
       if(response.data.success){
            if(!selectedTask){
                axios.post("/api/notifications/add-notification",{
                    title: `You have been assigned a new task in ${project.projectName}`,
                    description:values.description,
                    user: assignedtoUserId,
                    onClick:`/project/${project._id}`
                  },{headers:{authorization: localStorage.getItem("token")}});
            }
            reload();
            toast.success(response.data.message);
            setShowModal(false);
       }
       dispatch(SetLoading(false));
    } catch (error) {
        toast.error(error.message);
        dispatch(SetLoading(false));
    }
  }

  const validateEmail = () => {
    const projectEmployees = project.members.filter((member)=>member.role === "employee");
    const isValidEmployee = projectEmployees.find((employee)=>employee.user.email === email);
    return isValidEmployee? true: false;
  }
  return (
    <Modal 
        title={selectedTask?"Update Task":"Add Task"}
        style={{
            top: 150,
        }}
        open={showModal}
        onOk={()=>modalOk.current.submit()}
        onCancel={()=>setShowModal(false)}
        okText={selectedTask?"UPDATE":"CREATE"}
    >
        <Form layout='vertical' ref={modalOk} onFinish={onFinish} initialValues={{...selectedTask,assignedTo: selectedTask?selectedTask.assignedTo.email: ""}}>
            <Form.Item label="Task Name" name="taskName">
                <Input />
            </Form.Item>
            <Form.Item label="Task Description" name="description">
                <TextArea />
            </Form.Item>
            <Form.Item label="Assign To" name="assignedTo">
                <Input placeholder='Enter Assignee Email'
                    onChange={(e)=>setEmail(e.target.value)}
                    disabled={selectedTask?true: false}
                />
            </Form.Item>
            {email && !validateEmail() && (
                <div className='text-red-500 text-sm'>
                    <span>Please enter valid employee email</span>
                </div>
            )}
        </Form>
    </Modal>
  )
}

export default TaskAddForm