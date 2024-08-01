import React, { useRef } from 'react'
import { Modal, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { SetLoading } from '../redux/loaderSlice';
import axios from 'axios';

// Antd form and Modal for adding Members
function MemberAddForm({showModal,setShowModal, reload, project}) {
  console.log(project.members);
  const modalOk = useRef(null);
  const dispatch = useDispatch();

  const onFinish = async (values)=>{
    try {
        const emailExists = project.members.find((member)=>member.user.email === values.email);
        if(emailExists){
            toast.error("Already a Member of the project");
        } else {
            dispatch(SetLoading(true));
            const {data} = await axios.post("/api/projects/add-member",{
                projectId:project._id,
                email: values.email,
                role: values.role
            },{headers:{authorization: localStorage.getItem("token")}});
            if(data.success){
                toast.success(data.message);
                reload();
                setShowModal(false);
                dispatch(SetLoading(false));
            } else {
                toast.error(data.message)
            }
        }
    } catch (error) {
       toast.error(error.message);
       dispatch(SetLoading(false)); 
    }
  }
  return (
    <Modal 
        title="Add Member"
        open={showModal}
        onCancel={()=>setShowModal(false)}
        onOk={()=>modalOk.current.submit()}
        style={{
            top: 150,
        }}
    >
        <Form layout='vertical' ref={modalOk} onFinish={onFinish} initialValues={project}>
            <Form.Item
                label="Email"
                name="email"
                >
                <Input placeholder='Enter Email ' />
            </Form.Item>
            <Form.Item
                label="Role"
                name="role"
                >
                <select >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                </select>

            </Form.Item>

        </Form>
    </Modal>
  )
}

export default MemberAddForm;