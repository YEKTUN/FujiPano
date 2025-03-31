import { configureStore } from '@reduxjs/toolkit'
import LoginSignupReducer from './LoginSignupSlice'
import PanoReducer from './Pano/PanoSlice'
import TodoListReducer from './Pano/TodoListSlice'
import CurrentClockReducer from './Pano/CurrentClockSlice'
import TextElementReducer from './Pano/TextElementSlice'
import CountdownReducer from './Pano/CountdownSlice'
import ImageStockReducer from './Pano/ImageStockSlice'
import VideoStockReducer from './Pano/VideoStockSlice'
import PaymentReducer from './PaymentSlice'
import CalendarReducer from './Pano/CalendarSlice'

export const store = configureStore({
  reducer: {
    LoginSignup: LoginSignupReducer,
    Pano: PanoReducer,
    TodoList: TodoListReducer,
    CurrentClock: CurrentClockReducer,
    TextElement: TextElementReducer,
    Countdown: CountdownReducer,
    ImageStock: ImageStockReducer,
    VideoStock: VideoStockReducer,
    Payment: PaymentReducer,
    Calendar: CalendarReducer

  },
})