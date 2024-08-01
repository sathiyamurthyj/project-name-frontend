import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import CustomHr from "../components/customHr";
import {useNavigate} from "react-router-dom";

// Home page contains projects which user is being part of.Also Meta data about project is displayed
function Home() {
  const {user} = useSelector((state)=>state.users);
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // gets projects a user is being part of.project on click will take to project details page.
  const getProjects = async()=>{
    try {
      dispatch(SetLoading(true));
      const {data} = await axios.post("/api/projects/user-projects",{userId: user._id},{headers:{authorization: localStorage.getItem("token")}});
      dispatch(SetLoading(false));
      if(data.success){
        setProjects(data.projects);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(()=>{
    getProjects()
  },[]);

  return (
    <div>
      <h1 className="text-primary text-center md:text-left text-xl">
        Welcome {user?.username.toUpperCase()}.
      </h1>
      <h3 className="text-primary text-xl text-center underline">
        Projects Home Page.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        {projects.map((project)=>(
          <div className="flex flex-col gap-1 border border-solid border-gray-300 rounded-md p-2 cursor-pointer"
          onClick={()=> navigate(`/project/${project._id}`)} >
            <h1 className="text-violet-600 text-base uppercase">{project.projectName}</h1>
            <CustomHr />
            <div className='flex justify-between'>
              <span className='text-violet-500 text-sm font-semibold'>
                Created At:
              </span>
              <span className='text-violet-500 text-sm mx-2 font-semibold'>
                {new Date(project.createdAt).toLocaleString('en-in')}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-violet-500 text-sm font-semibold'>
                Created By:
              </span>
              <span className='text-violet-500 text-sm mx-2 font-semibold capitalize '>
                {project.manager.username}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-violet-500 text-sm font-semibold'>
                Project Status:
              </span>
              <span className='text-violet-500 text-sm mx-2 uppercase font-semibold'>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && 
      <div className='flex justify-center items-center h-96'>
        <h1 className='text-base text-red-400'>Projects Not found.Check with Program Manager on Project assignment.</h1>
      </div>}
    </div>
  )
}

export default Home;