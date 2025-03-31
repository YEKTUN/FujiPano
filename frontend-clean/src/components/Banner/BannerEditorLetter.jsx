import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoList from "../Pano/TodoList";
import Clock from "../Pano/Clock";
import TextElement from "../Pano/TextElement";
import Countdown from "../Pano/Countdown";
import ImageStock from "../Pano/ImageStock";
import VideoStock from "../Pano/VideoStock";
import Calendar from "../Pano/Calendar";

const BannerEditorLetter = ({ todoLists, clocks, calendars, textElements, countdowns, bannerAreaRef, panoId, userId , images, videos, isImageUploading, isVideoUploading}) => {
  return (
    <DndProvider backend={HTML5Backend}>

       
        <div
          ref={bannerAreaRef}
          className="relative bg-gray-400 h-full w-[1100px] border border-gray-500"
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
                width: 400,
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
                width: 300,
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

          {clocks?.map((clock) => (
            <DraggableElement
              key={clock._id}
              panoId={panoId}
              element={{
                id: clock._id,
                type: "clock",
                x: clock.XCoordinate || 0,
                y: clock.YCoordinate || 0,
                width: 300,
                height: 100,
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <Clock
                key={clock._id}
                clockId={clock._id}
                currentTime={clock.currentTime}
                panoId={panoId}
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
                width: 300,
                height: 100,
              }}
              bannerAreaRef={bannerAreaRef}
            >
              <TextElement
                key={text._id}
                textId={text._id}
                text={text.text}
                panoId={panoId}
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
                  height: 600,
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
  )
}

export default BannerEditorLetter