import { useDrag, useDrop } from "react-dnd";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

import { updateTodoListPosition } from "../../redux/Pano/TodoListSlice";
import { updateCurrentClock } from "../../redux/Pano/CurrentClockSlice";
import { updateTextElement } from "../../redux/Pano/TextElementSlice";
import { updateCountdown } from "../../redux/Pano/CountdownSlice";
import { updateImagePosition } from "../../redux/Pano/ImageStockSlice";
import { updateVideoPosition } from "../../redux/Pano/VideoStockSlice";
import { updateCalendarPosition } from "../../redux/Pano/CalendarSlice";

const MIN_SIZE = 20;

const typeToActionData = {
  todolist: { action: updateTodoListPosition, idKey: "todoListId" },
  clock: { action: updateCurrentClock, idKey: "clockId" },
  text: { action: updateTextElement, idKey: "textElementId" },
  countdown: { action: updateCountdown, idKey: "countdownId" },
  image: { action: updateImagePosition, idKey: "imageId" },
  video: { action: updateVideoPosition, idKey: "videoId" },
  calendar: { action: updateCalendarPosition, idKey: "calendarId" },
};

const DraggableElement = ({ element, bannerAreaRef, children }) => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const [localPosition, setLocalPosition] = useState({
    x: element.x,
    y: element.y,
  });

  const [localSize, setLocalSize] = useState({
    width: element.width,
    height: element.height,
  });

  const [isResizing, setIsResizing] = useState(false);

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsSelected(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "element",
    item: {
      id: element.id,
      elementType: element.type,
    },
    canDrag: () => !isResizing,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "element",
    hover: debounce((draggedItem, monitor) => {
      if (!containerRef.current || !bannerAreaRef.current) return;
      if (draggedItem.id !== element.id) return;

      const clientOffset = monitor.getClientOffset();
      const bannerRect = bannerAreaRef.current.getBoundingClientRect();

      const newX = clientOffset.x - bannerRect.left - localSize.width / 2;
      const newY = clientOffset.y - bannerRect.top - localSize.height / 2;

      setLocalPosition({ x: newX, y: newY });
      updatePositionInRedux(draggedItem.id, newX, newY);
    }, 100),
  });

  const [{ isHandleDragging }, dragResize] = useDrag({
    type: "resize-element",

    item: () => {
      setIsResizing(true);
      return { id: element.id };
    },
    collect: (monitor) => ({
      isHandleDragging: monitor.isDragging(),
    }),
    end: () => setIsResizing(false),
  });

  const [, dropResize] = useDrop({
    accept: "resize-element",
    hover: debounce((draggedItem, monitor) => {
      if (!bannerAreaRef.current) return;
      if (draggedItem.id !== element.id) return;

      const clientOffset = monitor.getClientOffset();
      const bannerRect = bannerAreaRef.current.getBoundingClientRect();

      const newWidth = clientOffset.x - bannerRect.left - localPosition.x;
      const newHeight = clientOffset.y - bannerRect.top - localPosition.y;

      if (newWidth >= MIN_SIZE && newHeight >= MIN_SIZE) {
        setLocalSize({ width: newWidth, height: newHeight });
      }
    }, 20),
  });

  drag(drop(containerRef));

  dragResize(dropResize(resizeHandleRef));

  const updatePositionInRedux = (id, x, y) => {
    const data = typeToActionData[element.type];
    if (!data) return;

    dispatch(
      data.action({
        [data.idKey]: id,
        XCoordinate: x,
        YCoordinate: y,
      })
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={handleElementClick}
      style={{
        position: "absolute",
        left: localPosition.x,
        top: localPosition.y,
        width: localSize.width,
        height: localSize.height,

        border: isSelected ? "2px solid #ccc" : null,
        boxSizing: "border-box",
        cursor: isResizing ? "default" : "move",
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      {children}

      {/* Sadece seçiliyse resize handle görünür */}
      {/* {isSelected && (
        <div
          ref={resizeHandleRef}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 15,
            height: 15,
            backgroundColor: "rgba(0,0,0,0.4)",
            cursor: "se-resize",
          }}
        />
      )} */}
    </div>
  );
};

export default DraggableElement;
