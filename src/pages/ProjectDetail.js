import React, { Children, useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import { SetLoading } from '../redux/loaderSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import CustomHr from '../components/customHr';
import {Tabs} from "antd";
import Members from './Members';
import Tasks from './Tasks';

function ProjectDetail() {
  const [myRole, setMyRole] = useState("");
  const {user} = useSelector(state=>state.users);
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();

  // gets project details based on project id.Contains tabs for tasks and members of project. 
  const getProject = async ()=>{
    try {
      dispatch(SetLoading(true));
      const {data} = await axios.post("/api/projects/project-by-id",{_id: params.id},{headers:{authorization: localStorage.getItem("token")}});
      dispatch(SetLoading(false));
      if(data.success){
        setProject(data.project);
        const currentUser = data.project.members.find(member=>member.user._id===user._id);
        setMyRole(currentUser.role);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(()=>{
    getProject();
  },[]);

  const items = [
    {
      key: "1",
      label: "Tasks",
      children:<Tasks project={project} />
    },
    {
      key: "2",
      label: "Members",
      children:<Members project={project} reload={getProject} />
    },
  ]

  return (
    project && 
    <div>
      <div className="flex flex-col items-center md:flex-row md:justify-between">
        <div>
          <h1 className="text-violet-600 text-2xl font- uppercase">
            {project?.projectName}
          </h1>
          <span className="text-violet-500 text-sm">
            {project?.description}
          </span>          
        </div>
        <div>
          <div className='flex gap-5'>
            <span className="text-violet-500 text-sm font-semibold">
              Created At:
            </span>
            <span className="text-violet-500 text-sm">
              {new Date(project.createdAt).toLocaleString('en-in')}
            </span>
          </div>
          <div className='flex gap-5'>
            <span className="text-violet-500 text-sm font-semibold">
              Created By:
            </span>
            <span className="text-violet-500 text-sm capitalize">
              {project.manager.username}
            </span>
          </div>
          <div className='flex gap-5'>
            <span className="text-violet-500 text-sm font-semibold">
              Logged In User Role:
            </span>
            <span className="text-violet-500 text-sm capitalize">
              {myRole}
            </span>
          </div>
        </div>
      </div>
      <CustomHr />
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}

export default ProjectDetail;