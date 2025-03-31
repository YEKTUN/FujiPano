const mongoose = require("mongoose");
const Pano = require("../../model/panoModel");
const Calendar = require("../../model/utils/markedCalender");

const createYearCalendar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { panoId } = req.params;
    const { year, XCoordinate, YCoordinate } = req.body;

    if (!panoId || !year) {
      return res.status(400).json({ error: "Pano ID ve yıl bilgisi gerekli." });
    }

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı" });
    }

    const newCalendar = await Calendar.create(
      [{ panoId, year, XCoordinate, YCoordinate, events: [] }],
      { session }
    );

    pano.markedCalendar.push(newCalendar[0]._id);
    await pano.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Yeni yıllık takvim oluşturuldu",
      data: newCalendar[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating calendar:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCalendars = async (req, res) => {
  try {
    const { panoId } = req.params;

    const calendar = await Calendar.find({ panoId });
    if (!calendar) {
      return res.status(404).json({ error: "Takvim bulunamadı" });
    }

    return res.status(200).json({
      message: "Takvim getirildi",
      data: calendar,
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCalendar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { calendarId } = req.params;

    const deletedCalendar = await Calendar.findByIdAndDelete(
      calendarId
    ).session(session);
    if (!deletedCalendar) {
      return res.status(404).json({ error: "Takvim bulunamadı" });
    }

    await Pano.updateMany(
      { markedCalendar: calendarId },
      { $pull: { markedCalendar: calendarId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Takvim silindi",
      data: deletedCalendar,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting calendar:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addEventToCalendar = async (req, res) => {
  try {
    const { calendarId } = req.params;
    const { title, description, color, start, end, allDay } = req.body;

    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      return res.status(404).json({ error: "Takvim bulunamadı" });
    }

    const newEvent = {
      title,
      description,
      color,
      start: new Date(start),
      end: end ? new Date(end) : new Date(start),
      allDay: allDay !== undefined ? allDay : true,
    };

    calendar.events.push(newEvent);
    await calendar.save();

    return res.status(201).json({
      message: "Etkinlik eklendi",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { calendarId } = req.params;
    const { eventId, title, description, color, start, end, allDay } = req.body;

    const calendar = await Calendar.findOne({ calendarId });
    if (!calendar) {
      return res.status(404).json({ error: "Takvim bulunamadı" });
    }

    const event = calendar.events.find((e) => String(e._id) === eventId);
    if (!event) {
      return res.status(404).json({ error: "Etkinlik bulunamadı" });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (color) event.color = color;
    if (start) event.start = new Date(start);
    if (end) event.end = new Date(end);
    if (allDay !== undefined) event.allDay = allDay;

    await calendar.save();

    return res.status(200).json({
      message: "Etkinlik güncellendi",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { calendarId, eventId } = req.params;

    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      return res.status(404).json({ error: "Takvim bulunamadı" });
    }

    const eventExists = calendar.events.some((e) => String(e._id) === eventId);
    if (!eventExists) {
      return res.status(404).json({ error: "Etkinlik bulunamadı" });
    }

    calendar.events = calendar.events.filter((e) => String(e._id) !== eventId);
    await calendar.save();

    return res.status(200).json({
      message: "Etkinlik silindi",
      eventId,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCalendarPosition = async (req, res) => {
  try {
    const { calendarId } = req.params;
    const { XCoordinate, YCoordinate } = req.body;

    const updatedCalendar = await Calendar.findByIdAndUpdate(
      calendarId,
      { XCoordinate, YCoordinate },
      { new: true }
    );

    if (!updatedCalendar) {
      return res.status(404).json({ message: "Takvim bulunamadı" });
    }

    return res.status(200).json({
      message: "Takvim konumu güncellendi",
      data: updatedCalendar,
    });
  } catch (error) {
    console.error("Error updating calendar position:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createYearCalendar,
  getCalendars,
  deleteCalendar,
  addEventToCalendar,
  updateEvent,
  deleteEvent,
  updateCalendarPosition,
};
