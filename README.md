# hotel_booking
A proof of concept type application to book hotel rooms

### Project setup
Get a clone of this repository
Go to the application folder
Run -> npm i

### Predefined data
We have used in-memory as a data storage, and have used multiple collections which are present inside /inMemoryDb folder

### List of APIs
1. get hotels
GET /hotels?search=
It searches the list of hotels on the basis of hotel name and location

2. book room
POST /book
Body: {
    "userId": 2,
    "roomIds": [1,2],
    "from": "2025-02-15T20:35:56.789Z",
    "to": "2025-02-16T12:34:56.789Z"
}
We can create the booking by passing romm numbers and the from and to dates. It will generate one order.

3. update booking
PUT /book
Body: {
    "orderId": 2,
    "userId": 2,
    "roomIds": [2, 3],
    "from": "2025-02-15T12:34:56.789Z",
    "to": "2025-02-16T12:34:56.789Z"
}
the order which was created on booking can be updated from here by passing orderId and the new rooms along with the date range.

4. delete booking
DELETE /book/{{orderId}}
The booking order can be deleted by orderId passed as a route param

5. All bookings
GET /book
We can view all of the bookings through this(Testing purpose only).
 
