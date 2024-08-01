import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from "react-hot-toast";
import axios from "axios";
import { SetNotifications } from '../redux/usersSlice';
import {SetLoading} from "../redux/loaderSlice";

// all logic for displaying and clearing notifications
function Notification({showModal, setShowModal}) {
  const {notifications}  = useSelector(state=>state.users); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dayjs.extend(relativeTime);

  const markReadNotifications = async()=>{
    try {
        const {data} = await axios.post("/api/notifications/mark-read-notifications",{},{headers:{authorization: localStorage.getItem("token")}});
        if(data.success){
            console.log(data);
            dispatch(SetNotifications(data.notifications));
        }
    } catch (error) {
        toast.error(error.message);
    }
  };

  const clearAllNotifications = async ()=>{
    try {
        dispatch(SetLoading(true));
        const {data} = await axios.delete("/api/notifications/delete-read-notifications",{headers:{authorization: localStorage.getItem("token")}});
        dispatch(SetLoading(false));
        if(data.success){
            dispatch(SetNotifications([]));
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        dispatch(SetLoading(false));
        toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(notifications.length>0){
        markReadNotifications();
    }
  },[]);

  return (
    <Modal
        title="Notifications"
        open={showModal}
        onCancel={()=>setShowModal(false)}
        style={{
            top: 150,
        }}
        footer={null}
        >
            <div className="flex flex-col justify-center items-center gap-5 mt-5">
                {notifications.length>0 ? (
                    <div className="flex justify-end">
                        <span className="text-base underline cursor-pointer" onClick={clearAllNotifications}>Clear All Notifications</span>
                    </div>
                ):(
                    <div className="flex justify-center">
                        <span className="text-base">No Notifications</span>
                    </div>
                )}
                {notifications.map((notification)=>(
                    <div className="flex justify-between items-end border border-solid p-2 rounded cursor-pointer"
                        onClick={()=>{
                            setShowModal(false);
                            navigate(notification.onClick)}
                        }>
                        <div className="flex flex-col">
                            <span className='text-md font-semibold text-gray-700'>{notification.title}</span>
                            <span className='text-sm'>{notification.description}</span>
                        </div>
                        <span className='text-sm'>{dayjs(notification.createdAt).fromNow()}</span>
                    </div>
                ))}
            </div>
        </Modal>
  )
}

export default Notification;