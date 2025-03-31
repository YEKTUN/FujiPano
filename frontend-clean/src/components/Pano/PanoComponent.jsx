import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPano, deletePano, getPanos } from "../../redux/Pano/PanoSlice";
import BannerEditor from "../Banner/BannerEditor";
import Header from "../pages/utils/Header";
import { IoMdAttach } from "react-icons/io";
import { useNavigate } from "react-router";
import { Alert } from "@mui/material";

const PanoComponent = () => {
  const dispatch = useDispatch();
  const { panos = [], loading, error } = useSelector((state) => state.Pano);
  const [panoName, setPanoName] = useState("");
  const [selectedPano, setSelectedPano] = useState(null);
  const token = localStorage.getItem("token");
  const membershipToken=localStorage.getItem("membership")||null;
  const userData = JSON.parse(decodeURIComponent(escape(atob(token.split(".")[1]))));
  const userDataMembership = membershipToken&&JSON.parse(decodeURIComponent(escape(atob(membershipToken?.split(".")[1]))));

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPanos(userData.id));
  }, [dispatch]);

  const handleCreatePano = () => {
    console.log(userData.membership);
    console.log(userDataMembership?.membership);
    
    // if (userData.membership == "Free" &&userDataMembership?.membership==null ) {
    //   alert("Uyelik satın almanız  gerekmektedir.");
    //   return;
    // }
    // if (userData.membership === "Başlangıç" || userDataMembership?.membership === "Başlangıç" && panos.length > 0) {
    //   alert("Başlangıç üyeliği sadece 1 pano oluşturabilir.");
    //   return;
    // }
    // if (userData.membership === "Uzman" || userDataMembership?.membership === "Uzman" && panos.length > 1) {
    //   alert("Uzman üyeliği sadece 2 pano oluşturabilir.");
    //   return;
    // }
    dispatch(createPano({ userId: userData.id, panoName }));
    setPanoName("");
  };

  const handleDeletePano = (panoId) => {
    dispatch(deletePano(panoId));
  };

  return (
    <div className="bg-[#212529]">
      <div className="rounded-2xl">
        <Header />
      </div>
      <div className="flex h-[1100px]">
     
        <div
          className=" space-x-4 p-4 w-1/4  shadow-lg 
              bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-800 
              text-white bg-opacity-90 backdrop-blur-lg overflow-y-scroll  hide-scrollbar "
        >
          <h1 className="text-xl font-bold mb-4">Panolar</h1>

       
          <div className="mb-4 ">
            <input
              type="text"
              value={panoName}
              onChange={(e) => setPanoName(e.target.value)}
              placeholder="Pano Adı"
              className=" rounded-2xl shadow-md p-2 w-full"
            />
            <button
              onClick={handleCreatePano}
              disabled={loading}
              className="bg-[#0D1632] cursor-pointer w-full mt-2 active:bg-[#425BAC] text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg "
            >
              {loading ? "Yükleniyor..." : "Pano Ekle"}
            </button>
          </div>

         
          <ul className="space-y-2 ">
            {panos.map((pano) => (
              <li
                key={pano._id}
                className={`p-2 flex justify-between items-center cursor-pointer rounded-xl  transition-all duration-300 ease-in-out ${
                  selectedPano?._id === pano._id
                    ? "bg-blue-900 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
                onClick={() => {
                  setSelectedPano(pano);
                 
                }}
              >
                <span>{pano.panoName}</span>
                <div className="flex justify-center items-center gap-4 ">
                  <button
                    className=" shadow-2xl  p-2 transition-all duration-300 ease-in-out bg-amber-400 hover:bg-amber-700 cursor-pointer active:bg-amber-500 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pano/${pano._id}`,{ state: "vertical" });
                    }}
                  >
                    <IoMdAttach />
                  </button>
                  <button
                    className=" shadow-2xl  transform rotate-90 p-2 transition-all duration-300 ease-in-out bg-amber-400 hover:bg-amber-700 cursor-pointer active:bg-amber-500 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pano/${pano._id}`,{ state: "yatay" });
                    }}
                  >
                    <IoMdAttach />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center "
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDeletePano(pano._id);
                    }}
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

     
        <div
          className=" space-x-4 p-4 w-3/4  shadow-lg 
              bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-800 
              text-black bg-opacity-90 backdrop-blur-lg overflow-y-scroll  hide-scrollbar "
        >
          {selectedPano ? (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {selectedPano.panoName} Panosu
              </h2>
              <BannerEditor userId={userData.id} panoId={selectedPano._id} />
            </div>
          ) : (
            <p className="text-center text-gray-white">Bir pano seçiniz...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanoComponent;
