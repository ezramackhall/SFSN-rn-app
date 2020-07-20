class Event {
    constructor(id, parentId, nannyId, timeCreated, startDate, endDate, bookingDetails, accepted){
        this.id = id,
        this.parentId = parentId, 
        this.nannyId = nannyId,
        this.timeCreated = timeCreated,
        this.startDate = startDate,
        this.endDate = endDate
        this.bookingDetails = bookingDetails,
        this.accepted = accepted
    }
}

export default Event;