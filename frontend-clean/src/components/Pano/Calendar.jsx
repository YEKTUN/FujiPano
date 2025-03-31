import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, updateEvent, deleteEvent, deleteCalendar, getCalendars } from "../../redux/Pano/CalendarSlice";
import CalendarEditModal from "./modal/CalendarEditModal";

const Calendar = ({ calendarId, panoId }) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDates, setSelectedDates] = useState(new Map());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { calendars, loading } = useSelector((state) => state.Calendar);
  const calendar = calendars.find((c) => c._id === calendarId);

  useEffect(() => {
    if (calendar) {
      setEvents([...new Map(calendar.events.map(item => [item._id, item])).values()]);
    }
  }, [calendar]);

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const handleDateSelect = async (selectInfo) => {
    let title = prompt("Etkinlik Adı:");
    if (!title) return;

    let startDateStr = selectInfo.startStr; 
    let endDateStr = prompt("Bitiş Tarihi (YYYY-MM-DD):", startDateStr);
    if (!endDateStr) return;

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (startDate > endDate) {
      alert("Bitiş tarihi, başlangıç tarihinden önce olamaz!");
      return;
    }

    const randomColor = getRandomColor();
    const newEvent = {
      calendarId: calendar._id,
      title,
      description: "",
      start: startDateStr,
      end: endDateStr,
      allDay: selectInfo.allDay,
      color: randomColor,
    };

    try {
      const result = await dispatch(addEvent(newEvent)).unwrap();
      setEvents(prevEvents => [...prevEvents, result.event]);
      await dispatch(getCalendars(panoId));
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
    }
  };

  const handleEditEvent = () => {
    setIsEditModalOpen(true);
    setContextMenu(null);
  };
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  const handleContextMenuClick = (event) => {
    event.preventDefault();
    setContextMenu(
      {
        x: event.clientX,
        y: event.clientY,
      }
    );
  };
  const handleEventClick = async (clickInfo) => {
    const confirmDelete = window.confirm(`"${clickInfo.event.title}" etkinliğini silmek istiyor musunuz?`);
    
    if (confirmDelete) {
      try {
        await dispatch(deleteEvent({ calendarId, eventId: clickInfo.event.id })).unwrap();
        setEvents(events.filter(event => event._id !== clickInfo.event.id));
        await dispatch(getCalendars(panoId));
      } catch (error) {
        console.error("Etkinlik silinirken hata oluştu:", error);
      }
    }
  };

  return (
    <div onContextMenu={handleContextMenuClick} onClick={handleCloseContextMenu} className="  ">
      {loading ? (
        <p>Takvim yükleniyor...</p>
      ) : (
        <div className="w-[400px] flext  h-[600px] p-4    ">
          <FullCalendar
    
          height="400px"   
          aspectRatio={1.5} 
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            editable={true}
            events={events.map(event => ({
              id: event._id,
              title: event.title,
              start: event.start,
              end: event.end || event.start,
              allDay: event.allDay,
              backgroundColor: event.color,
            }))}
            select={handleDateSelect}
            eventClick={handleEventClick} 
         
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locale="tr"
          />

          <div className="w-[370px] h-[170px] p-4 bg-white border rounded-lg shadow-md overflow-y-scroll hide-scrollbar">
            <h3 className="text-lg font-bold flex items-center">
              📌 Etkinlikler
            </h3>
            <ul>
              {events.map(event => (
                <li key={event._id} className="flex items-center space-x-2 p-2 border-b w-64">
                  <span
                    className="min-w-10 h-4 rounded-full block"
                    style={{ backgroundColor: selectedDates.get(event.start.split("T")[0]) || event.color }}
                  ></span>
                  <span>{event.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className=" bg-white shadow-md border rounded p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {/* <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={handleEditEvent}>
            ⚙ Ayarlar
          </button> */}
          <button className="block w-full text-left p-2 hover:bg-gray-200 text-red-600" onClick={() => dispatch(deleteCalendar(calendarId))}>
            ❌ Takvimi Sil
          </button>
        </div>
      )}

      <CalendarEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(title, color) => {
          if (selectedEvent) {
            dispatch(updateEvent({ calendarId, eventId: selectedEvent._id, title, color }));
            setIsEditModalOpen(false);
          }
        }}
      />
    </div>
  );
};

export default Calendar;
