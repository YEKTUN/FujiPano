import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
// Formik & Yup
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "../../redux/LoginSignupSlice";
import {  toast,ToastContainer } from 'react-toastify';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("İsim-Soyisim zorunludur."),
  email: Yup.string()
    .email("Geçerli bir e-posta giriniz.")
    .required("E-posta adresi zorunludur."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .required("Şifre zorunludur."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor.")
    .required("Şifre tekrar zorunludur."),
});

const SignupPage = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {user,loading,error,token}=useSelector(state=>state.LoginSignup);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async(values) => {
   const result=await dispatch(registerUser(values));
   if (registerUser.fulfilled.match(result)) {
    values.name="";
    values.email="";
    values.password="";
    values.confirmPassword="";
    toast("Kayıt olundu");
   
    setTimeout(() => {
      navigate("/login");
    }, 2000);
   }else if (registerUser.rejected.match(result)) {
    toast("Kayıt basarısız");
   }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
         <ToastContainer  />
      <div className="w-[400px] p-8 bg-white shadow-md rounded-lg space-y-6">
       
        <h2 className="text-3xl text-gray-800 font-bold text-center mb-6">
          Kayıt Ol!
        </h2>

      
        <div className="flex justify-center mb-6 pt-4">
          <img src="photo/logo.png" alt="Logo" className="h-18" />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleBlur, handleChange }) => (
            <Form>
            
              <div className="relative px-6 mt-6 group mb-8">
                <span
                  className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                    isFocused.name || values.name
                      ? "text-blue-500 -top-4 text-sm"
                      : "text-gray-500 top-3"
                  }`}
                >
                  İsim-Soyisim
                </span>
                <Field
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 outline-none transition-all duration-300 
                             focus:outline-none focus:border-transparent group-focus-within:border-transparent"
                  onFocus={() => setIsFocused((prev) => ({ ...prev, name: true }))}
                  onBlur={(e) => {
                    handleBlur(e);
                    setIsFocused((prev) => ({
                      ...prev,
                      name: values.name !== "",
                    }));
                  }}
                  onChange={handleChange}
                />
               
                <div
                  className="absolute left-8 bottom-0 w-[275px] h-[2px] bg-gradient-to-r from-blue-900 to-orange-500 
                             transform scale-x-0 origin-left transition-transform duration-500 group-focus-within:scale-x-100"
                ></div>
              
                <ErrorMessage
                  name="name"
                  component="div"
                  className="absolute left-8 bottom-[-20px] text-red-500 text-sm"
                />
              </div>

             
              <div className="relative px-6 mt-6 group mb-8">
                <span
                  className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                    isFocused.email || values.email
                      ? "text-blue-500 -top-4 text-sm"
                      : "text-gray-500 top-3"
                  }`}
                >
                  E-Posta
                </span>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 outline-none transition-all duration-300 
                             focus:outline-none focus:border-transparent group-focus-within:border-transparent"
                  onFocus={() => setIsFocused((prev) => ({ ...prev, email: true }))}
                  onBlur={(e) => {
                    handleBlur(e);
                    setIsFocused((prev) => ({
                      ...prev,
                      email: values.email !== "",
                    }));
                  }}
                  onChange={handleChange}
                />
                <div
                  className="absolute left-8 bottom-0 w-[275px] h-[2px] bg-gradient-to-r from-blue-900 to-orange-500 
                             transform scale-x-0 origin-left transition-transform duration-500 group-focus-within:scale-x-100"
                ></div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="absolute left-8 bottom-[-20px] text-red-500 text-sm"
                />
              </div>

             
              <div className="relative px-6 mt-6 group mb-8">
                <span
                  className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                    isFocused.password || values.password
                      ? "text-blue-500 -top-4 text-sm"
                      : "text-gray-500 top-3"
                  }`}
                >
                  Şifre
                </span>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 outline-none transition-all duration-300 
                             focus:outline-none focus:border-transparent group-focus-within:border-transparent"
                  onFocus={() => setIsFocused((prev) => ({ ...prev, password: true }))}
                  onBlur={(e) => {
                    handleBlur(e);
                    setIsFocused((prev) => ({
                      ...prev,
                      password: values.password !== "",
                    }));
                  }}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-8 top-2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOutline className="hover:text-blue-300 transition-all duration-300" />
                  ) : (
                    <IoEyeOffOutline className="hover:text-blue-300 transition-all duration-300" />
                  )}
                </span>
                <div
                  className="absolute left-8 bottom-0 w-[275px] h-[2px] bg-gradient-to-r from-blue-900 to-orange-500 
                             transform scale-x-0 origin-left transition-transform duration-500 group-focus-within:scale-x-100"
                ></div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="absolute left-8 bottom-[-20px] text-red-500 text-sm"
                />
              </div>

             
              <div className="relative px-6 mt-6 group mb-8">
                <span
                  className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                    isFocused.confirmPassword || values.confirmPassword
                      ? "text-blue-500 -top-4 text-sm"
                      : "text-gray-500 top-3"
                  }`}
                >
                  Şifre Tekrar
                </span>
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 outline-none transition-all duration-300 
                             focus:outline-none focus:border-transparent group-focus-within:border-transparent"
                  onFocus={() =>
                    setIsFocused((prev) => ({
                      ...prev,
                      confirmPassword: true,
                    }))
                  }
                  onBlur={(e) => {
                    handleBlur(e);
                    setIsFocused((prev) => ({
                      ...prev,
                      confirmPassword: values.confirmPassword !== "",
                    }));
                  }}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-8 top-2 cursor-pointer text-gray-500"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <IoEyeOutline className="hover:text-blue-300 transition-all duration-300" />
                  ) : (
                    <IoEyeOffOutline className="hover:text-blue-300 transition-all duration-300" />
                  )}
                </span>
                <div
                  className="absolute left-8 bottom-0 w-[275px] h-[2px] bg-gradient-to-r from-blue-900 to-orange-500 
                             transform scale-x-0 origin-left transition-transform duration-500 group-focus-within:scale-x-100"
                ></div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="absolute left-8 bottom-[-20px] text-red-500 text-sm"
                />
              </div>

              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-[300px] h-[50px] py-2 text-white font-bold rounded-3xl  mt-8 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#304960] to-[#EF5A29] transition-transform duration-500 ease-in-out transform group-hover:translate-x-full"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#EF5A29] to-[#304960] transition-transform duration-500 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
                  <span className="relative z-10">KAYIT OL!</span>
                </button>
              </div>

              <p className="text-center text-gray-600 mt-8">
                Hesabın var mı?{" "}
                <Link to="/login" className="text-gray-800 hover:underline">
                  Giriş Yap!
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
