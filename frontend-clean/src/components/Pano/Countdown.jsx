// src/components/CountdownComponent.js
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateCountdown,
  getCountdowns,
  deleteCountdown,
} from "../../redux/Pano/CountdownSlice";
import CountdownEditModal from "./modal/CountdownEditModal";

const Countdown = ({ countdown, panoId }) => {
  const dispatch = useDispatch();

  const [remaining, setRemaining] = useState(countdown.remainingMinutes);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    setRemaining(countdown.remainingMinutes);
  }, [countdown.remainingMinutes]);

  useEffect(() => {
    if (remaining <= 0) return;
    const intervalId = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
      dispatch(
        updateCountdown({
          countdownId: countdown._id,
          message: countdown.message,
          remainingMinutes: remaining - 1,
          XCoordinate: countdown.XCoordinate,
          YCoordinate: countdown.YCoordinate,
        })
      );
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch, countdown, remaining]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCountdown(countdown._id)).unwrap();
      await dispatch(getCountdowns(panoId));
    } catch (error) {
      console.error("❌ Countdown silinirken hata:", error);
    }
    handleCloseContextMenu();
  };

  const getTimeParts = (totalMinutes) => {
    if (totalMinutes <= 0) {
      return { d: "00", h: "00", m: "00" };
    }
    const days = Math.floor(totalMinutes / 1440);
    const leftover = totalMinutes % 1440;
    const hours = Math.floor(leftover / 60);
    const minutes = leftover % 60;

    const dStr = days < 10 ? `0${days}` : `${days}`;
    const hStr = hours < 10 ? `0${hours}` : `${hours}`;
    const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return { d: dStr, h: hStr, m: mStr };
  };

  const { d, h, m } = getTimeParts(remaining);

  return (
    <div
      className="relative mb-4 p-2"
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
    >
      <div className="text-xl font-bold text-white mb-2">
        {countdown.message}
      </div>

      <div className="flex space-x-4 items-center">
        <div className="flex flex-col items-center p-2 bg-gray-800 rounded shadow">
          <div className="text-4xl font-bold text-white w-12 text-center">
            {d}
          </div>
          <div className="text-xs font-semibold text-white uppercase">Days</div>
        </div>

        <div className="flex flex-col items-center p-2 bg-gray-800 rounded shadow">
          <div className="text-4xl font-bold text-white w-12 text-center">
            {h}
          </div>
          <div className="text-xs font-semibold text-white uppercase">Hrs</div>
        </div>

        <div className="flex flex-col items-center p-2 bg-gray-800 rounded shadow">
          <div className="text-4xl font-bold text-white w-12 text-center">
            {m}
          </div>
          <div className="text-xs font-semibold text-white uppercase">Mins</div>
        </div>
      </div>

      {contextMenu && (
        <div
          className="bg-white shadow-lg border rounded-md  w-[225px] z-10"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsModalOpen(true);
              handleCloseContextMenu();
            }}
          >
            ✏️ Düzenle
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={handleDelete}
          >
            🗑️ Sil
          </button>
        </div>
      )}

      <CountdownEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        countdown={{
          _id: countdown._id,
          message: countdown.message,
          remainingMinutes: remaining,
          XCoordinate: countdown.XCoordinate,
          YCoordinate: countdown.YCoordinate,
        }}
        panoId={panoId}
      />
    </div>
  );
};

export default Countdown;
