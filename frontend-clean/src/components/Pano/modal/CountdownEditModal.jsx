// src/components/CountdownEditModal.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCountdown, getCountdowns } from "../../../redux/Pano/CountdownSlice";


const CountdownEditModal = ({ isOpen, onClose, countdown,panoId }) => {
  const dispatch = useDispatch();

 
  const [message, setMessage] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

 
  const convertRemainingToDHM = (totalMinutes) => {
    const d = Math.floor(totalMinutes / 1440); 
    const leftover = totalMinutes % 1440;
    const h = Math.floor(leftover / 60);
    const m = leftover % 60;
    return { d, h, m };
  };

 
  useEffect(() => {
    if (countdown) {
      setMessage(countdown.message || "");

     
      const { d, h, m } = convertRemainingToDHM(countdown.remainingMinutes || 0);
      setDays(d);
      setHours(h);
      setMinutes(m);
    }
  }, [countdown]);

 
  if (!isOpen) return null;


  const handleSave = async(e) => {
    e.preventDefault();

   
    const totalMinutes =
      (parseInt(days) || 0) * 1440 +
      (parseInt(hours) || 0) * 60 +
      (parseInt(minutes) || 0);

 

    await dispatch(
      updateCountdown({
        countdownId: countdown._id,
        message,
        remainingMinutes: totalMinutes,
        XCoordinate: countdown.XCoordinate,
        YCoordinate: countdown.YCoordinate,
      })
    ).unwrap();
    await dispatch(getCountdowns(panoId));

   
    onClose();
  };

  return (
   
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-80 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Edit Countdown</h2>
        <form onSubmit={handleSave}>
         
          <div className="mb-3">
            <label className="block text-sm font-medium">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>

        
          <div className="mb-3">
            <label className="block text-sm font-medium">Days</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Hours</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Minutes</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>

          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountdownEditModal;
