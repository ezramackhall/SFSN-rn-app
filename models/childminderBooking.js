class ChildminderBooking {
    constructor(id, parent, nanny, requestDate, startDate, endDate, numberOfChildren, description, acceptedDate, isPaid){
        this.id = id, 
        this.parent = parent,
        this.nanny = nanny,
        this.requestDate = requestDate,
        this.startDate = startDate,
        this.endDate = endDate,
        this.numberOfChildren = numberOfChildren,
        this.description = description,
        this.acceptedDate = acceptedDate,
        this.isPaid = isPaid
    };
};

export default ChildminderBooking;