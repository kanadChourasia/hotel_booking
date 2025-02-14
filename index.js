const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

const hotelServices = require("./services/hotels");
const bookingServices = require("./services/bookings");

app.use(bodyParser.json());

app.get('/hotels', (req, res) => {
    const hotelList = hotelServices.getListOfHotels(req.query)
    res.json({
        success:true,
        data: hotelList
    })
})

app.post('/book', (req, res) => {
    const {userId, roomIds, from, to} = req.body;
    const booking = bookingServices.bookRooms({
        userId,
        roomIds,
        from: new Date(from),
        to: new Date(to)
    })
    res.json(booking)
})

app.get('/book', (req, res) => {
    const booking = bookingServices.getAllBookings();
    res.json({
        success: true,
        data: booking
    })
})

app.put('/book', (req, res) => {
    const {orderId, userId, roomIds, from, to} = req.body;
    const booking = bookingServices.updateBooking({
        orderId,
        userId,
        roomIds,
        from: new Date(from),
        to: new Date(to)
    })
    res.json(booking)
})

app.delete('/book/:orderId', (req, res) => {
    const { orderId } = req.params;
    const deletedData = bookingServices.removeOrderBookings(orderId);
    res.json(deletedData);
})


app.listen(PORT, (error) => {
    if (error) throw new Error(`Failed to listen on port ${PORT}`);
    console.log(`Application is listening on port ${PORT}`);
})