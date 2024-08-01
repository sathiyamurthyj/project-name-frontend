import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { SetLoading } from '../redux/loaderSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

// Antd form and Modal for adding Projects
function ProjectAddForm({showModal,setShowModal, reload, project}) {
  const modalOk = useRef(null); 
  const {user} = useSelector((state)=>state.users); 
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if(project){
        values._id = project._id;
        response = await axios.post("/api/projects/edit-project",values,{headers:{authorization: localStorage.getItem("token")}});
      } else {
        values.manager = user._id;
        values.members = [{
          user: user._id,
          role: "manager"
        },];
        response = await axios.post("/api/projects/create-project",values,{headers:{authorization: localStorage.getItem("token")}});
      }
      if (response.data.success) {
        toast.success(response.data.message);
        reload();
        setShowModal(false);
        } else {
        toast.error(response.data.message)
        }
      } catch (error) {
        dispatch(SetLoading(false));
      }
  };
  return (
    <Modal 
        title={project?"Edit Project":"Add Project"}
        open={showModal}
        onCancel={()=>setShowModal(false)}
        onOk={()=>modalOk.current.submit()}
        style={{
            top: 150,
        }}
    >
        <Form layout='vertical' ref={modalOk} onFinish={onFinish} initialValues={project}>
            <Form.Item
                label="Project Name"
                name="projectName"
                >
                <Input placeholder='Enter Project Name' />
            </Form.Item>
            <Form.Item
                label="Project Description"
                name="description"
                >
                <TextArea placeholder='Enter Project Description' />
            </Form.Item>

        </Form>
    </Modal>
  )
}

export default ProjectAddForm;