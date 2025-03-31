import { useRef, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DraggableElement from "./DraggableElement";
import { useSelector, useDispatch } from "react-redux";


import { getTodoLists, createTodoList } from "../../redux/Pano/TodoListSlice";
import {
  getCurrentClock,
  createClock,
} from "../../redux/Pano/CurrentClockSlice";
import {
  getTextElements,
  createTextElement,
} from "../../redux/Pano/TextElementSlice";
import {
  getCountdowns,
  createCountdown,
} from "../../redux/Pano/CountdownSlice";
import { uploadImage, getImages } from "../../redux/Pano/ImageStockSlice";
import { uploadVideo, getVideos } from "../../redux/Pano/VideoStockSlice";
import { getCalendars, createCalendar } from "../../redux/Pano/CalendarSlice";
import CircularProgress from "@mui/material/CircularProgress";


import TodoList from "../Pano/TodoList";
import Clock from "../Pano/Clock";
import TextElement from "../Pano/TextElement";
import Countdown from "../Pano/Countdown";
import ImageStock from "../Pano/ImageStock";
import VideoStock from "../Pano/VideoStock";
import Calendar from "../Pano/Calendar";


const BannerEditor = ({ panoId, userId,isViewMode=true, orientation   }) => {
  const bannerAreaRef = useRef(null);
  const dispatch = useDispatch();

  
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);


  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

 
  const { todoLists } = useSelector((state) => state.TodoList);
  const { clocks } = useSelector((state) => state.CurrentClock);
  const { textElements } = useSelector((state) => state.TextElement);
  const { countdowns } = useSelector((state) => state.Countdown);
  const { images } = useSelector((state) => state.ImageStock);
  const { videos } = useSelector((state) => state.VideoStock);
  const { calendars } = useSelector((state) => state.Calendar);


  useEffect(() => {
    if (panoId) {
      dispatch(getCurrentClock(panoId));
      dispatch(getTextElements(panoId));
      dispatch(getCountdowns(panoId));
      dispatch(getImages(panoId));
      dispatch(getVideos(panoId));
      dispatch(getTodoLists(panoId));
      dispatch(getCalendars(panoId));
    }
  }, [dispatch, panoId, userId]);


  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };


  const handleImageChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsImageUploading(true);
    try {
    
      const XCoordinate = 100;
      const YCoordinate = 100;
      await dispatch(
        uploadImage({
          panoId,
          imageFile: selectedFile,
          XCoordinate,
          YCoordinate,
        })
      ).unwrap();

      
     await dispatch(getImages(panoId)); 
    } catch (error) {
      console.error("Resim yüklenirken hata oluştu:", error);
    } finally {
      setIsImageUploading(false);
     
      e.target.value = "";
    }
  };

 
  const handleVideoButtonClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };


  const handleVideoChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsVideoUploading(true);
    try {
      const XCoordinate = 100;
      const YCoordinate = 100;
      await dispatch(
        uploadVideo({
          panoId,
          videoFile: selectedFile,
          XCoordinate,
          YCoordinate,
        })
      ).unwrap();
       dispatch(getVideos(panoId)); 
    } catch (error) {
      console.error("Video yüklenirken hata oluştu:", error);
    } finally {
      setIsVideoUploading(false);
      e.target.value = "";
    }
  };

 
  const addCalendar = async () => {
    const XCoordinate = 100;
    const YCoordinate = 100;
    try {
      await dispatch(
        createCalendar({ panoId, year: 2024, XCoordinate, YCoordinate })
      ).unwrap();
     dispatch(getCalendars(panoId));
    } catch (error) {
      console.error("❌ Takvim eklenirken hata oluştu:", error);
    }
  };

  const addTodoList = async () => {
    const XCoordinate = 100;
    const YCoordinate = 100;
    try {
      await dispatch(
        createTodoList({ panoId, XCoordinate, YCoordinate })
      ).unwrap();
       dispatch(getTodoLists(panoId));
    } catch (error) {
      console.error("❌ TodoList eklenirken hata oluştu:", error);
    }
  };

  
  const addTextElement = async() => {
    const XCoordinate = 100;
    const YCoordinate = 100;
    try {
      
      await dispatch(
        createTextElement({ panoId, text: "Merhaba", XCoordinate, YCoordinate })
      ).unwrap();
     dispatch(getTextElements(panoId));
    } catch (error) {
      console.log("❌ Yazı eklenirken hata oluştu:", error);
      
    }
  };

  const addCountdown = async () => {
    const XCoordinate = 100;
    const YCoordinate = 100;
    try {
      await dispatch(
        createCountdown({
          panoId,
          message: "Selam",
          remainingMinutes: 0,
          XCoordinate,
          YCoordinate,
        })
      ).unwrap();
      dispatch(getCountdowns(panoId));
    } catch (error) {
      console.error("❌ Geri sayım eklenirken hata:", error);
    }
  };
  const addCurrentClock = async() => {
    const XCoordinate = 100;
    const YCoordinate = 100;
    try {
      
      await dispatch(createClock({ panoId, XCoordinate, YCoordinate })).unwrap();
      dispatch(getCurrentClock(panoId));
      
    } catch (error) {
      console.log("❌ Saat eklenirken hata oluştu:", error);
      
    }
  };
 
  
  const panoContainerClasses =
  orientation === "horizontal"
      ? " bg-gray-400 flex flex-col overflow-hidden h-[1500px] w-[1150px] transform -rotate-90  ml-6  "
      : "bg-gray-400 flex flex-col overflow-hidden h-[1500px] w-[1100px] mt-10 ";

  return (
    <div
    //  className="bg-gray-400 h-[1200px] w-[1100px] "
     className={panoContainerClasses}

     >
        {isViewMode&&
        <div
          className="flex space-x-4 p-4 w-full  shadow-lg 
              bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-800 
              text-white bg-opacity-90 backdrop-blur-lg"
        >
          <button
            className="bg-[#0D1632] cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={addTodoList}
          >
            TodoList Ekle
          </button>
          <button
            className="bg-[#0D1632]  cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={addTextElement}
          >
            Metin Ekle
          </button>
          <button
            className="bg-[#0D1632]  cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={addCountdown}
          >
            Geri Sayım Ekle
          </button>
          <button
            className="bg-[#0D1632]  cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={handleImageButtonClick}
          >
            Resim Ekle
          </button>
          <input
            ref={imageInputRef}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            className="bg-[#0D1632]  cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={handleVideoButtonClick}
          >
            Video Ekle
          </button>
          <input
            ref={videoInputRef}
            style={{ display: "none" }}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
          <button
            className="bg-[#0D1632]  cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={addCalendar}
          >
            Takvim Ekle
          </button>
          <button
            className="bg-[#0D1632]  cursor-pointer active:bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={addCurrentClock}
          >
            Saat Ekle
          </button>
        </div>}
   
      <DndProvider  backend={HTML5Backend}>

       
        <div
          ref={bannerAreaRef}
          className="relative bg-gray-400 h-[1500px] w-[1150px] border border-gray-500 "
          // className={panoContainerClasses}
        >
          {calendars?.map((calendar) => (
            <DraggableElement
              key={calendar?._id}
              panoId={panoId}
              element={{
                id: calendar?._id,
                type: "calendar",
                x: calendar?.XCoordinate || 100,
                y: calendar?.YCoordinate || 100,
                width: 100,
                height: 100,
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <Calendar calendarId={calendar?._id} panoId={panoId} />
            </DraggableElement>
          ))}

          {todoLists?.map((todoList) => (
            <DraggableElement
              key={todoList?._id}
              panoId={panoId}
              element={{
                id: todoList?._id,
                type: "todolist",
                x: todoList?.XCoordinate,
                y: todoList?.YCoordinate,
                width: 100,
                height: 100,
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <TodoList
                userId={userId}
                key={todoList?._id}
                listItem={todoList}
                todoListId={todoList?._id}
                todoItems={todoList.todoItems}
                panoId={panoId}
              />
            </DraggableElement>
          ))}

          {clocks.map((clock) => (
            <DraggableElement
              key={clock._id}
              panoId={panoId}
              element={{
                id: clock._id,
                type: "clock",
                x: clock.XCoordinate || 0,
                y: clock.YCoordinate || 0,
                width: 100,
                height: 100,
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <Clock
                key={clock._id}
                clockId={clock._id}
                currentTime={clock.currentTime}
                panoId={panoId}
                fontSize={clock.fontSize}
                fontColor={clock.fontColor}
                fontFamily ={clock.fontFamily }
              />
            </DraggableElement>
          ))}

          {textElements.map((text) => (
            <DraggableElement
              key={text._id}
              panoId={panoId}
              element={{
                id: text._id,
                type: "text",
                x: text.XCoordinate || 0,
                y: text.YCoordinate || 0,
                width: text.textWidth || 100, 
                height: text.fontSize * 1.5 || 30, 
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <TextElement
                key={text._id}
                textId={text._id}
                text={text.text}
                panoId={panoId}
                fontSize={text.fontSize}
                fontColor={text.fontColor}
                fontFamily ={text.fontFamily }
              />
            </DraggableElement>
          ))}

          {countdowns.map((countdown) => (
            <DraggableElement
              key={countdown._id}
              panoId={panoId}
              element={{
                id: countdown._id,
                type: "countdown",
                x: countdown.XCoordinate || 0,
                y: countdown.YCoordinate || 0,
                width: 100,
                height: 100,
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <Countdown
                key={countdown._id}
                countdownId={countdown._id}
                message={countdown.message}
                startTime={countdown.startTime}
                countdown={countdown}
                panoId={panoId}
              />
            </DraggableElement>
          ))}

          {isImageUploading ? (
            <div className="flex flex-col justify-center items-center">
              <div>Resim yükleniyor...</div> <CircularProgress size={20} />
            </div>
          ) : (
            images.map((image) => (
              <DraggableElement
                key={image._id}
                panoId={panoId}
                element={{
                  id: image._id,
                  type: "image",
                  x: image.XCoordinate || 0,
                  y: image.YCoordinate || 0,
                  width: 300,
                  height: 300,
                }}
                bannerAreaRef={bannerAreaRef}
              >
                <ImageStock
                  key={image._id}
                  imageId={image._id}
                  imageUrl={image.imageUrl}
                  panoId={panoId}
                />
              </DraggableElement>
            ))
          )}

          {isVideoUploading ? (
            <div className="flex flex-col justify-center items-center">
              <div>Video yükleniyor...</div> <CircularProgress size={20} />
            </div>
          ) : (
            videos.map((video) => (
              <DraggableElement
                key={video._id}
                panoId={panoId}
                element={{
                  id: video._id,
                  type: "video",
                  x: video.XCoordinate || 0,
                  y: video.YCoordinate || 0,
                  width: 300,
                  height: 100,
                }}
                bannerAreaRef={bannerAreaRef}
              >
                <VideoStock
                  key={video._id}
                  videoId={video._id}
                  videoUrl={video.videoUrl}
                  panoId={panoId}
                  video={video}
                />
              </DraggableElement>
            ))
          )}
        </div>
      </DndProvider>
    </div>
  );
};

export default BannerEditor;
