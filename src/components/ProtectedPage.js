import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetNotifications, SetUser } from '../redux/usersSlice';
import { SetLoading } from '../redux/loaderSlice';
import { Avatar, Badge, Layout, Menu} from 'antd';
import Notification from './Notification';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import axiosBaseUrl from './httpcommon';

// component for protected routes which can be accessed by only valid logged in user
// also contains basic layout
function ProtectedPage({children}) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const {user, notifications} = useSelector((state)=>state.users);
    
    const getLoggedInUser = async() => {
        try {
            dispatch(SetLoading(true));
            const {data} = await axiosBaseUrl.get("/api/users/logged-in-user",{headers:{authorization: localStorage.getItem("token")}});
            dispatch(SetLoading(false));
            console.log(data);
            if(data.success){                
                dispatch(SetUser(data.user));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            dispatch(SetLoading(false));
            toast.error(error.message);
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const getNotifications = async()=>{
        try {
            dispatch(SetLoading(true));
            const {data} = await axiosBaseUrl.get("/api/notifications/user-notifications",{headers:{authorization: localStorage.getItem("token")}});
            dispatch(SetLoading(false));
            if(data.success){
                dispatch(SetNotifications(data.notifications));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            dispatch(SetLoading(false));
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(localStorage.getItem("token")){
            getLoggedInUser();
        } else{
            navigate("/login");
        }
    },[]);

    useEffect(()=>{
        if(user){
            getNotifications();
        }
    },[user]);

    return (
        user && <div>
        <Layout>
            <Header 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor:'#34D399',
                }}
                >
                <h1 className='text-base md:text-xl cursor-pointer' onClick={()=>navigate("/")}>SAT-PM</h1>
                <div className='flex items-center bg-white px-4 py-3 rounded'>
                    <span className="cursor-pointer underline mr-2 text-xl" onClick={()=>navigate("/profile")}>{user?.username}</span>
                    <Badge count={notifications?.filter((notification)=>!notification.read).length} className='cursor-pointer'>
                        <Avatar shape="square" size="small" icon={<i className="fa-regular fa-bell rounded-full text-white"></i>} onClick={()=>setShowModal(true)} />
                    </Badge>
                    <i className="fa-solid fa-arrow-right-from-bracket cursor-pointer ml-4"
                    onClick={()=>{
                        toast.success("User Logged Out");
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                    ></i>
                </div>
            </Header>
            <Layout>
                <Sider
                    breakpoint='md'
                    collapsedWidth="0"
                    width={200}
                    style={{
                        height:'100vh'
                        }}
                >
                <Menu mode='inline' theme='dark'>
                <Menu.Item>
                <NavLink to="/profile">Profile</NavLink>
                </Menu.Item>
                <Menu.Item>
                <NavLink to="/">Projects</NavLink>
                </Menu.Item>
                </Menu>
                </Sider>
            <Layout>
                <Content>
                    <div className='px-4 py-3'>
                        {children}
                    </div>

                    {showModal && (<Notification showModal={showModal} setShowModal={setShowModal} />)}
                    
                </Content>
            </Layout>
            </Layout>
            </Layout>
        </div>
    )
}

export default ProtectedPage;