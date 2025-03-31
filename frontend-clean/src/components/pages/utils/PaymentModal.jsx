import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayment } from "../../../redux/PaymentSlice";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
const PaymentModal = ({ isOpen, onClose, selectedPackage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentStatus, paymentData, paymentError } = useSelector(
    (state) => state.Payment
  );

  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    if (paymentStatus === "succeeded" && paymentData?.status == "success") {
      onClose();
      setCardHolderName("");
      setCardNumber("");
      setExpireMonth("");
      setExpireYear("");
      setCvc("");
    }
  }, [paymentStatus, paymentData, navigate, onClose]);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Lütfen giriş yapın.");
      return;
    }

    const userData = JSON.parse(atob(token.split(".")[1]));

    const paymentInfo = {
      price: selectedPackage.price,
      email: userData.email,
      userId: userData.id,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      membership: selectedPackage.title,
    };
    const result = await dispatch(createPayment(paymentInfo));
    if (createPayment.fulfilled.match(result)) {
      setCardHolderName("");
      setCardNumber("");
      setExpireMonth("");
      setExpireYear("");
      setCvc("");

      toast("Ödeme Başarılı");

      setTimeout(() => {
        onClose();
      }, 1000);
    }else if (createPayment.rejected.match(result)) {
      toast("Ödeme Basarısız");
    }
  };
  if (!isOpen || !selectedPackage) return null; // Eğer modal kapalıysa veya paket seçili değilse hiç gösterme.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg w-[450px] text-black">
        <h2 className="text-xl font-bold text-center">
          {selectedPackage.title} Planını Satın Al
        </h2>
        <p className="text-lg text-center my-2">
          {selectedPackage.price}₺ / Aylık
        </p>

        {paymentError && (
          <p className="text-red-500 text-sm">{paymentError.message}</p>
        )}

        <div className="mt-4">
          <label className="block text-sm font-semibold">Kart Sahibi</label>
          <input
            type="text"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ad Soyad"
          />
        </div>

        <div className="mt-2">
          <label className="block text-sm font-semibold">Kart Numarası</label>
          <input
           maxLength={16}
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <div className="w-1/2">
            <label className="block text-sm font-semibold">
              Son Kullanma Ay
            </label>
            <input
            maxLength={2}
              type="text"
              value={expireMonth}
              onChange={(e) => setExpireMonth(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="MM"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-semibold">
              Son Kullanma Yıl
            </label>
            <input
            maxLength={4}
              type="text"
              value={expireYear}
              onChange={(e) => setExpireYear(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="YYYY"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-semibold">CVC</label>
          <input
          maxLength={3}
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="123"
          />
        </div>

        <button
          onClick={handlePayment}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
          disabled={paymentStatus === "loading"}
        >
          {paymentStatus === "loading"
            ? "İşlem Yapılıyor..."
            : "Ödemeyi Tamamla"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
