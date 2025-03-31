import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./utils/Footer";
import Header from "./utils/Header";
import {jwtDecode} from "jwt-decode";



const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000); 

          if (decodedToken.exp < currentTime) {
            console.log("Token süresi doldu, çıkış yapılıyor...");
            localStorage.removeItem("token");
            window.location.reload(); 
          }
        } catch (error) {
          console.error("Hatalı token:", error);
        }
      }
    }, 60000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const membershipToken = localStorage.getItem("membership");

      if (membershipToken) {
        try {
          const decodedToken = jwtDecode(membershipToken);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp < currentTime) {
            console.log("Membership token süresi doldu, çıkış yapılıyor...");
            localStorage.removeItem("membership");
            window.location.reload(); 
          }
        } catch (error) {
          console.error("Hatalı membership token:", error);
        }
      }
    }, 60000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="min-h-screen bg-[#212529] text-white  flex justify-center">
      <div className="w-[1000px]">
      <Header/>
   
      
      
      <div className="container mx-auto py-10">
        <h1 className="text-center text-4xl font-bold">DijiPano</h1>
        <br/><br/>

        {sections.map((section, index) => (
          <div key={index} className="border-t border-b border-gray-700 flex flex-col md:flex-row items-center py-6">
            {index % 2 === 0 && (
              <div className="w-full md:w-1/3 flex justify-center">
                <img src={section.img} className="h-48 w-48 object-contain" alt={section.title}/>
              </div>
            )}
            <div className="w-full md:w-2/3 text-center md:text-left px-6">
              <h3 className="text-2xl font-semibold py-3">{section.title}</h3>
              <p className="text-gray-300">{section.text}</p>
            </div>
            {index % 2 !== 0 && (
              <div className="w-full md:w-1/3 flex justify-center">
                <img src={section.img} className="h-48 w-48 object-contain" alt={section.title}/>
              </div>
            )}
          </div>
        ))}
      </div>

     <Footer/>
      </div>
     
    </div>
  );
};

const sections = [
  {
    title: "Fotoğraf/Video Ekleme",
    text: "Değerli kullanıcılarımıza, kendi panolarını tasarlarken kullandığımız bulut tabanlı platform üzerinden fotoğraf veya video ekleyerek panolarında kullanabilme imkanı sunuyoruz.",
    img: "photo/photo.png"
  },
  {
    title: "Metin Ekleme",
    text: "Kullanıcılarımıza, panolarını kişiselleştirirken kolayca metin ekleyebilme imkanı sunuyoruz. Bu sayede, her bir pano daha özgün ve ihtiyaçlara uygun hale getirilebiliyor.",
    img: "photo/letter.png"
  },
  {
    title: "Geri Sayım Ekleme",
    text: "Kullanıcılarımıza, panolarında geri sayım özelliğini kullanarak önemli tarihlere odaklanma imkanı sunuyoruz. Böylece, yaklaşan etkinlik veya projelere kolayca zaman sayabilir ve panolarını daha işlevsel hale getirebilirler.",
    img: "photo/countdown.png"
  },
  {
    title: "Takvim Ekleme",
    text: "Kullanıcılarımıza, panolarında takvim özelliğini kullanarak etkinliklerini ve önemli tarihleri kolayca takip etme imkanı sunuyoruz.",
    img: "photo/calendar.png"
  },
  {
    title: "Gündelik Program Ekleme",
    text: "Kullanıcılarımıza, panolarında günlük program özelliğiyle tüm planlarını düzenleyerek daha verimli bir şekilde odaklanma imkanı sunuyoruz.",
    img: "photo/daily.png"
  }
];

export default HomePage;
