import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import ProjectAddForm from '../components/ProjectAddForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

// project page containing project add form modal and table listing projects created by user
// only user who created project can delete.
function ProjectPage() {
  const [projects, setProjects]  = useState([]);
  const [projectSelected, setProjectSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {user} = useSelector((state)=>state.users);
  const dispatch = useDispatch();  

  const getProjects = async ()=>{
    try {
      dispatch(SetLoading(true));
      const {data} = await axios.post("/api/projects/all-projects",{manager: user._id},{headers:{authorization: localStorage.getItem("token")}});
      if(data.success){
        setProjects(data.projects);
        dispatch(SetLoading(false));
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const deleteProject = async(id) => {
    try {
      dispatch(SetLoading(true));
      const {data} = await axios.post("/api/projects/delete-project",{_id:id},{headers:{authorization: localStorage.getItem("token")}});
      if(data.success){
        toast.success(data.message);
        getProjects();
      } else{
        toast.error(data.error)
      }
      dispatch(SetLoading(false));
    } catch (error) {
      toast.error(error.message);
      dispatch(SetLoading(false));
    }
  }

  useEffect(()=>{
    getProjects();
  },[]);

  // antd project table columns
  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      width:90
    },
    {
      title: "Project Description",
      dataIndex: "description",
      width:90
    },
    {
      title: "Status",
      dataIndex: "status",
      ellipsis: true
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render:(date)=>new Date(date).toLocaleString('en-in'),
      ellipsis: true
    },
    {
      title:"Action",
      dataIndex: "action",
      render: (text, record)=>{
        return (
          <div className='flex gap-4'>
            <i 
              className="fa-regular fa-pen-to-square cursor-pointer"
              onClick={()=>{
                setProjectSelected(record);
                setShowModal(true);
              }}
              ></i>
            <i 
              className="fa-solid fa-trash cursor-pointer"
              onClick={()=>deleteProject(record._id)}
              ></i>
          </div>
        )
      },
      ellipsis: true
    }    
  ];
  return (
    <div>
        <div className='flex justify-end'>
            <Button type='default' onClick={()=>{
              setProjectSelected(null);
              setShowModal(true)
              }
            }>Add Project</Button>
        </div>
        <Table columns={columns} dataSource={projects} />
        {showModal && <ProjectAddForm showModal={showModal} setShowModal={setShowModal} reload={getProjects} project={projectSelected} />}
    </div>
  )
}

export default ProjectPage;