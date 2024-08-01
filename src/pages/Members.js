import { Button, Table } from 'antd';
import React, { useState } from 'react'
import MemberAddForm from '../components/MemberAddForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import toast from 'react-hot-toast';
import axiosBaseUrl from "../components/httpcommon";

// fills info on Members Tab of Project Details Page.Contains add/delete operations related to member
function Members({project, reload}) {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("");
  const {user} = useSelector(state=>state.users);
  const dispatch = useDispatch();
  const isManager = project.manager._id === user._id;

  // delete member from project
  const deleteMember = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const {data} = await axiosBaseUrl.post("/api/projects/delete-member",{projectId:project._id,memberId},{headers:{authorization: localStorage.getItem("token")}});
      if(data.success){
        reload();
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

  // antd member table column details
  const columns = [
    {
      title: "Member Name",
      dataIndex: "username",
      render:(text,record)=>record.user.username,
      width:100
    },
    {
      title: "Email",
      dataIndex: "email",
      render:(text, record)=>record.user.email,
      width:80
    },
    {
      title:"Role",
      dataIndex: "role",
      render: (text, record)=>record.role.toUpperCase(),
      ellipsis: true
    },
    {
      title:"Action",
      dataIndex: "action",
      render: (text, record)=>(
            <i 
              className="fa-solid fa-trash cursor-pointer ml-4"
              onClick={()=>deleteMember(record._id)}
              ></i>
      ),
      ellipsis: true
      }
  ];

  if(!isManager){
    columns.pop();
  }

  
  return (
    <div>
      <div className='flex justify-end'>
        {isManager && <Button type='default' onClick={()=>setShowModal(true)}>
          Add Member
        </Button>}
      </div>

      <div className='w-48'>
        <span>Select Role</span>
        <select onChange={(e)=>setRole(e.target.value)} value={role}>
          <option value="">All</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <Table columns={columns} dataSource={
        project.members.filter((member)=>{
          if(role===""){
            return true;
          } else {
            return member.role === role;
          }
      })
      } className='mt-4' />

      {showModal&& (
        <MemberAddForm showModal={showModal} setShowModal={setShowModal} reload={reload} project={project} />
      )}
    </div>
  )
}

export default Members;