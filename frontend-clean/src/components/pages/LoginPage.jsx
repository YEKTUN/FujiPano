import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "../../redux/LoginSignupSlice";
import {  toast,ToastContainer } from 'react-toastify';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta giriniz.")
    .required("E-posta zorunludur."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .required("Şifre zorunludur."),
});

const LoginPage = () => {
  const dispatch=useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
  
  
    if (loginUser.fulfilled.match(result)) {
  
      values.email="";
      values.password="";
   
      toast("Giriş yapıldı");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }else if (loginUser.rejected.match(result)) {
      toast("Giriş basarısız");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
       <ToastContainer  />
      <div className="w-[400px] h-[700px] max-w-md p-8 bg-white shadow-md rounded-lg">
        <div className="mt-16">
          <h2 className="text-3xl text-gray-800 font-bold text-center mb-6">
            Giriş Yap!
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
             
                <div className="relative px-6 mt-12 group mb-10">
                  <span
                    className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                      isFocused.email || values.email
                        ? "text-blue-500 -top-4 text-sm"
                        : "text-gray-500 top-2"
                    }`}
                  >
                    E-Posta
                  </span>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 outline-none 
                               transition-all duration-300 focus:border-transparent group-focus-within:border-transparent"
                    onFocus={() =>
                      setIsFocused((prev) => ({ ...prev, email: true }))
                    }
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
                               transform scale-x-0 origin-left transition-transform duration-500 
                               group-focus-within:scale-x-100 focus:scale-x-100"
                  />
                  
                  <ErrorMessage name="email">
                    {(msg) => (
                      <p className="absolute left-8 bottom-[-20px] text-red-500 text-sm z-10">
                        {msg}
                      </p>
                    )}
                  </ErrorMessage>
                </div>

              
                <div className="relative px-6 mt-12 group mb-10">
                  <span
                    className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                      isFocused.password || values.password
                        ? "text-blue-500 -top-4 text-sm"
                        : "text-gray-500 top-2"
                    }`}
                  >
                    Şifre
                  </span>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 outline-none 
                               transition-all duration-300 focus:border-transparent group-focus-within:border-transparent"
                    onFocus={() =>
                      setIsFocused((prev) => ({ ...prev, password: true }))
                    }
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
                               transform scale-x-0 origin-left transition-transform duration-500 
                               group-focus-within:scale-x-100 focus:scale-x-100"
                  />
                
                  <ErrorMessage name="password">
                    {(msg) => (
                      <p className="absolute left-8 bottom-[-20px] text-red-500 text-sm z-10">
                        {msg}
                      </p>
                    )}
                  </ErrorMessage>
                </div>

                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-[270px] h-[50px] py-2 text-white font-bold rounded-3xl  mt-10 relative overflow-hidden group"
                  >
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-[#304960] to-[#EF5A29] 
                                 transition-transform duration-500 ease-in-out transform group-hover:translate-x-full"
                    />
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-[#EF5A29] to-[#304960] 
                                 transition-transform duration-500 ease-in-out transform -translate-x-full 
                                 group-hover:translate-x-0"
                    />
                    <span className="relative z-10">GİRİŞ YAP</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <p className="text-center text-gray-600 mt-18">
            Hesabın yok mu?{" "}
            <Link to="/register" className="text-gray-800 hover:underline">
              Kayıt Ol!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
