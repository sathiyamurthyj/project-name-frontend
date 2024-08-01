import React, { useEffect } from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import axios from "axios";
import CustomHr from '../components/customHr';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { SetButtonLoading } from '../redux/loaderSlice';
import ClipLoader from "react-spinners/ClipLoader";

// login pages containing formik login form and yup schema for form validation
function Login() {
  const loginSchema = Yup.object().shape({
    email:Yup.string().email("Must be valid Email").required("Email is Required"),
    password:Yup.string().min(6,"Must be atleast 6 characters").required("Required")
  });
   
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {buttonLoading} = useSelector((state)=>state.loaders);

  useEffect(()=>{
    if(localStorage.getItem("token")) {
      navigate("/");
    }
  },[]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div className='h-screen flex flex-col justify-center items-center pattern'>
        <div className='mx-2'>
          <h1 className='text-6xl'>SAT-PM</h1>
          <span className='text-xl'>Project Management Tool for Software Development.</span>
          <div className='mt-4'>
            <span className='text-xl'>Tool features includes:</span>
            <ul className='list-none'>
              <li>Manage Users.</li>
              <li>Manage Projects.</li>
              <li>Manage Members.</li>
              <li>Manage Tasks.</li>
              <li>Success/Error Notifications</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center pattern1 mx-2 my-2 md:my-0'>
        <div className='w-[500px]'>
          <h1 className='text-2xl text-gray-700'>Login To Your Account</h1>
          <CustomHr />
          <Formik
            initialValues={{
              email:"",
              password:""
            }}
            validationSchema={loginSchema}
            onSubmit={async(values,{setSubmitting, resetForm})=>{
              try {
                dispatch(SetButtonLoading(true));
                const {data} = await axios.post("/api/users/login", values);
                dispatch(SetButtonLoading(false));
                if(!data.success){
                  toast.error(data.message);
                } else {
                  localStorage.setItem("token", data.token)
                  toast.success(data.message);
                  navigate("/");
                }
              } catch (err) {
                dispatch(SetButtonLoading(false));
                toast.error(err.message);
              }
              console.log(values);
              setSubmitting(false)
              resetForm()              
            }
            }>
              <Form>
                <div className='flex flex-col'>
                  <label htmlFor='email'>Email</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name='email'>{ msg => <div style={{ color: 'red' }}>{msg}</div> }</ErrorMessage>
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='password'>Password</label>
                  <Field name="password" type="password" />
                  <ErrorMessage name='password'>{ msg => <div style={{ color: 'red' }}>{msg}</div> }</ErrorMessage>
                </div>
                <div className='flex flex-col'>
                  <button type='submit' className='text-xl'>{buttonLoading?<ClipLoader color="white" />: "Login"}</button>
                </div>
                <div className='flex justify-center mt-5'>
                  <span>New to Site?<Link to="/register">Register</Link></span>
                </div>
              </Form>
            </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login;