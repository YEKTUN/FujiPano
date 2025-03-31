import React, { useEffect, useState } from "react";
import Footer from "./utils/Footer";
import Header from "./utils/Header";
import PaymentModal from "./utils/PaymentModal";

const PricingPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  const token = localStorage.getItem("token");
  const tokenMembership = localStorage.getItem("membership");

  let membershipData = null;
  if (tokenMembership) {
    try {
      const parts = tokenMembership.split(".");
      if (parts.length === 3) {
        const decodedPayload = decodeURIComponent(escape(atob(parts[1])));
        membershipData = JSON.parse(decodedPayload);
      } else {
        console.warn("Geçersiz membership token formatı:", tokenMembership);
      }
    } catch (error) {
      console.error("Membership token çözümleme hatası:", error);
    }
  }
  console.log("Membership Data:", membershipData);

  useEffect(() => {
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      setDecodedToken(JSON.parse(jsonPayload));

      console.log("Çözümlenen Token:", JSON.parse(jsonPayload));
    }
  }, []);

  const userMembership =
    membershipData?.membership || decodedToken?.membership || "Free";

  const membershipLevels = ["Free", "Başlangıç", "Uzman", "Profesyonel"];

  const userMembershipIndex = membershipLevels.indexOf(userMembership);

  return (
    <div className="min-h-screen bg-[#212529] text-white  flex justify-center">
      <div className="w-[1000px]">
        <Header />

        <div className="container mx-auto py-10 text-center">
          <h1 className="text-4xl font-bold">Paketler</h1>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => {
              const packageIndex = membershipLevels.indexOf(pkg.title);
              const isDisabled = packageIndex <= userMembershipIndex;

              return (
                <div
                  key={index}
                  className={`border rounded-lg space-y-4 h-[240px] shadow-lg p-6 ${
                    pkg.highlight ? "bg-blue-600" : "bg-gray-800"
                  }`}
                >
                  <h3 className="text-xl font-semibold">{pkg.title}</h3>
                  <p className="text-3xl font-bold mt-2">
                    {pkg.price}₺
                    <span className="text-lg font-light">/Aylık</span>
                  </p>
                  <p className="text-gray-300 mt-2">{pkg.description}</p>
                  <button
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsModalOpen(true);
                    }}
                    className={`mt-4 w-full py-2 ${
                      isDisabled
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700"
                    } text-white rounded-md transition`}
                  >
                    {isDisabled ? "Zaten Sahipsiniz" : "Satın Al!"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container mx-auto py-10">
          <h2 className="text-center text-3xl font-semibold">
            Planları Karşılaştır
          </h2>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-700 p-3">Özellikler</th>
                  {packages.map((pkg, index) => (
                    <th key={index} className="border border-gray-700 p-3">
                      {pkg.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border border-gray-700">
                    <td className="border border-gray-700 p-3 text-center">
                      {feature.name}
                    </td>
                    {feature.values.map((value, i) => (
                      <td
                        key={i}
                        className="border border-gray-700 p-3 text-center"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedPackage={selectedPackage}
        />

        <Footer />
      </div>
    </div>
  );
};

const packages = [
  {
    title: "Başlangıç",
    price: 150,
    description: "1 Kişiselleştirilmiş Pano",
    highlight: false,
  },
  {
    title: "Uzman",
    price: 200,
    description: "2 Kişiselleştirilmiş Pano",
    highlight: false,
  },
  {
    title: "Profesyonel",
    price: 250,
    description: "Sınırsız Kişiselleştirilmiş Pano",
    highlight: true,
  },
];

const features = [
  { name: "Pano Sayısı", values: ["1", "2", "Sınırsız"] },
  { name: "Metin Ekleme", values: ["✔", "✔", "✔"] },
  { name: "Video/Fotoğraf Ekleme", values: ["✔", "✔", "✔"] },
  { name: "Aylık Takvim", values: ["✔", "✔", "✔"] },
  { name: "Günlük Program", values: ["✔", "✔", "✔"] },
  { name: "Geri Sayım", values: ["✔", "✔", "✔"] },
];

export default PricingPage;
