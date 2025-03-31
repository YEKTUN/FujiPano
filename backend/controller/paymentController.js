const Iyzipay = require("iyzipay");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const Payment = require("../model/paymentModel");
const Auth = require("../model/authModel");
const jwt = require("jsonwebtoken");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: "https://sandbox-api.iyzipay.com",
});

/**
 * 1. Direkt Ödeme (3D Secure'suz)
 */
const createPayment = async (req, res) => {
  try {
    const {
      email,
      price,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      userId,
      membership,
    } = req.body;

    const conversationId = uuidv4();
    const paymentId = uuidv4();

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,

      paymentCard: {
        cardHolderName,
        cardNumber,
        expireMonth,
        expireYear,
        cvc,
        registerCard: "0",
      },

      buyer: {
        id: userId || "BY789",
        name: cardHolderName,
        surname: "Doe",
        identityNumber: "11111111111",
        email: email || "test@test.com",
        registrationAddress: "Test Address",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },

      billingAddress: {
        contactName: "John Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Fatura Adresi: Örnek Mah. No:1",
        zipCode: "34000",
      },

      shippingAddress: {
        contactName: "John Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Teslimat Adresi: Örnek Mah. No:2",
        zipCode: "34000",
      },

      basketItems: [
        {
          id: uuidv4(),
          name: membership || "Free",
          category1: "Pano",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: price,
        },
      ],
    };

    const result = await new Promise((resolve, reject) => {
      iyzipay.payment.create(request, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (result.status === "success") {
      const newPayment = new Payment({
        userId,
        conversationId,
        paymentId,
        status: "success",
        price,
        currency: "TRY",
        cardHolderName,
      });
      const membershipExpireDate = new Date();
      membershipExpireDate.setDate(membershipExpireDate.getDate() + 30);

      await newPayment.save();
      const updatedUser = await Auth.findByIdAndUpdate(
        userId,
        { membership, membershipExpireDate },
        { new: true }
      );
      const newToken = jwt.sign(
        {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          membership: updatedUser.membership,
          membershipExpireDate: updatedUser.membershipExpireDate,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      console.log(updatedUser);

      return res.status(200).json({ success: true, newToken });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("[createPayment Error]", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: uuidv4(),
      paymentId: paymentId,
    };

    const paymentResult = await new Promise((resolve, reject) => {
      iyzipay.payment.retrieve(request, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    return res.status(200).json(paymentResult);
  } catch (error) {
    console.error("[getPayment Error]", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const start3DPayment = async (req, res) => {
  try {
    const {
      price,
      email,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      userId,
      membership,
    } = req.body;

    const conversationId = uuidv4();

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "http://localhost:5000/payment/complete-3d-payment",

      paymentCard: {
        cardHolderName,
        cardNumber,
        expireMonth,
        expireYear,
        cvc,
        registerCard: "0",
      },

      buyer: {
        id: userId,
        name: cardHolderName,
        surname: "1",
        identityNumber: "11111111111",
        email: email || "test@test.com",
        registrationAddress: "Test Address",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },

      billingAddress: {
        contactName: "John Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Fatura Adresi: Örnek Mah. No:1",
        zipCode: "34000",
      },

      shippingAddress: {
        contactName: "John Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Teslimat Adresi: Örnek Mah. No:2",
        zipCode: "34000",
      },

      basketItems: [
        {
          id: uuidv4(),
          name: membership,
          category1: "Pano",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: price,
        },
      ],
    };

    const result = await new Promise((resolve, reject) => {
      iyzipay.threedsInitialize.create(request, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (result.status === "success") {
      const newPayment = new Payment({
        userId,
        conversationId,
        status: "pending",
        price,
        currency: "TRY",
        cardHolderName,
      });

      await newPayment.save();
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("[start3DPayment Error]", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const complete3DPayment = async (req, res) => {
  try {
    const { paymentId, conversationData, conversationId } = req.body;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      paymentId,
      conversationData,
    };

    const result = await new Promise((resolve, reject) => {
      iyzipay.threedsPayment.create(request, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (result.status === "success") {
      await Payment.findOneAndUpdate(
        { conversationId },
        {
          $set: {
            paymentId: result.paymentId,
            status: "success",
          },
        },
        { new: true }
      );
    } else {
      await Payment.findOneAndUpdate(
        { conversationId },
        {
          $set: { status: "failed" },
        },
        { new: true }
      );
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("[complete3DPayment Error]", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  createPayment,
  getPayment,
  start3DPayment,
  complete3DPayment,
};
