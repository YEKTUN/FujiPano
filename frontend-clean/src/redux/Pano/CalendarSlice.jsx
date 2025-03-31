import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Url";


export const createCalendar = createAsyncThunk(
  "calendar/create",
  async ({ panoId, year, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/pano/marked-calendar/create/${panoId}`,
        { year, XCoordinate, YCoordinate }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getCalendars = createAsyncThunk(
  "calendar/getAll",
  async ( panoId , { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/pano/marked-calendar/get-all-calendars/${panoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteCalendar = createAsyncThunk(
  "calendar/delete",
  async (calendarId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pano/marked-calendar/delete-calendar/${calendarId}`);
      return calendarId; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const addEvent = createAsyncThunk(
  "calendar/addEvent",
  async ({ calendarId, title, description, color, start, end, allDay }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/pano/marked-calendar/add-event/${calendarId}`,
        { title, description, color, start, end, allDay }
      );
      return { calendarId, event: response.data.data }; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async ({ calendarId, eventId, title, description, color, start, end, allDay }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/marked-calendar/update-event/${calendarId}`,
        { eventId, title, description, color, start, end, allDay }
      );
      return { calendarId, updatedEvent: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async ({ calendarId, eventId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pano/marked-calendar/delete-event/${eventId}/${calendarId}`);
      return { calendarId, eventId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateCalendarPosition = createAsyncThunk(
  "calendar/updateCalendarPosition",
  async ({ calendarId, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/marked-calendar/update-calendar-position/${calendarId}`,
        { XCoordinate, YCoordinate }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  calendars: [], 
  loading: false,
  error: null,
};

export const CalendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(createCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars.push(action.payload.data);
      })
      .addCase(createCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getCalendars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalendars.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars = action.payload.data;
      })
      .addCase(getCalendars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(deleteCalendar.fulfilled, (state, action) => {
        state.calendars = state.calendars.filter((c) => c._id !== action.payload);
      })

      
      .addCase(addEvent.fulfilled, (state, action) => {
        const { calendarId, event } = action.payload;
        const calendar = state.calendars.find((c) => c._id === calendarId);
        if (calendar) {
          calendar.events.push(event);
        }
      })

     
      .addCase(updateEvent.fulfilled, (state, action) => {
        const { calendarId, updatedEvent } = action.payload;
        const calendar = state.calendars.find((c) => c._id === calendarId);
        if (calendar) {
          const eventIndex = calendar.events.findIndex((e) => e._id === updatedEvent._id);
          if (eventIndex !== -1) {
            calendar.events[eventIndex] = updatedEvent;
          }
        }
      })

     
      .addCase(deleteEvent.fulfilled, (state, action) => {
        const { calendarId, eventId } = action.payload;
        const calendar = state.calendars.find((c) => c._id === calendarId);
        if (calendar) {
          calendar.events = calendar.events.filter((e) => e._id !== eventId);
        }
      })

     
      .addCase(updateCalendarPosition.fulfilled, (state, action) => {
        const updatedCalendar = action.payload.data;
        const index = state.calendars.findIndex((c) => c._id === updatedCalendar._id);
        if (index !== -1) {
          state.calendars[index] = updatedCalendar;
        }
      });
  },
});

export default CalendarSlice.reducer;
