const router = require('express').Router();
const upload = require("../middleware/multer");
const panoController=require('../controller/pano/panoController')
const todoListController=require('../controller/pano/todoListController')
const currentClockController=require('../controller/pano/currentClockController')
const textElementController=require('../controller/pano/textElementController')
const countdownController=require('../controller/pano/countdownController')
const imageStockController=require('../controller/pano/imageStockController')
const videoStockController=require('../controller/pano/videoStockController')
const markedCalendarController=require('../controller/pano/markedCalendarController')

router.post("/create-pano", panoController.createPano);
router.delete("/delete-pano/:panoId", panoController.deletePano);
router.get("/get-panos/:userId", panoController.getPanos);

router.post('/todolist/create', todoListController.createTodoList);
router.get('/todolist/get/:panoId', todoListController.getTodoLists);
router.put('/todolist/update-position/:todoListId', todoListController.updateTodoListPosition);
router.delete('/todolist/delete/:todoListId', todoListController.deleteTodoList);


router.get('/todolist/:todoListId/items', todoListController.getTodoListItems);
router.post('/todolist/:todoListId/add-item', todoListController.addTodoItem);
router.put('/todolist/:todoListId/update-item/:todoItemIndex', todoListController.updateTodoItem);
router.delete('/todolist/:todoListId/delete-item/:todoItemId', todoListController.deleteTodoItem);

router.post('/current-clock/create/:panoId', currentClockController.createClock);
router.put('/current-clock/update/:clockId', currentClockController.updateCurrentClock);
router.get('/current-clock/get/:panoId', currentClockController.getCurrentClock);
router.delete('/current-clock/delete/:clockId', currentClockController.deleteCurrentClock);

router.post('/text-element/create/:panoId', textElementController.createTextElement);
router.get('/text-element/get/:panoId', textElementController.getTextElements);
router.put('/text-element/update/:textElementId', textElementController.updateTextElement);
router.delete('/text-element/delete/:textElementId', textElementController.deleteTextElement);

router.post('/countdown/create/:panoId', countdownController.createCountdown);
router.get('/countdown/get/:panoId', countdownController.getCountdowns);
router.put('/countdown/update/:countdownId', countdownController.updateCountdown);
router.delete('/countdown/delete/:countdownId', countdownController.deleteCountdown);

router.post('/image-stock/upload/:panoId', upload.single('image'), imageStockController.uploadImage);
router.get('/image-stock/get/:panoId', imageStockController.getImages);
router.delete('/image-stock/delete/:imageId', imageStockController.deleteImage);
router.put('/image-stock/update-position/:imageId', imageStockController.updateImagePosition);

router.post('/video-stock/upload/:panoId', upload.single('video'), videoStockController.uploadVideo);
router.get('/video-stock/get/:panoId', videoStockController.getVideos);
router.delete('/video-stock/delete/:videoId', videoStockController.deleteVideo);
router.put('/video-stock/update-position/:videoId', videoStockController.updateVideoPosition);




router.post("/marked-calendar/create/:panoId", markedCalendarController.createYearCalendar);
router.put("/marked-calendar/update-event/:calendarId", markedCalendarController.updateEvent);
router.delete("/marked-calendar/delete-event/:eventId/:calendarId", markedCalendarController.deleteEvent);
router.post("/marked-calendar/add-event/:calendarId", markedCalendarController.addEventToCalendar);
router.delete("/marked-calendar/delete-calendar/:calendarId", markedCalendarController.deleteCalendar);
router.put("/marked-calendar/update-calendar-position/:calendarId", markedCalendarController.updateCalendarPosition);
router.get("/marked-calendar/get-all-calendars/:panoId", markedCalendarController.getCalendars);










module.exports = router;