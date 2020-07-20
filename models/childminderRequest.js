class ChildminderRequest {
    constructor(id, user, requestDate, startDate, endDate, numberOfChildren, description){
        this.id = id,
        this.user = user,
        this.requestDate = requestDate,
        this.startDate = startDate,
        this.endDate = endDate,
        this.numberOfChildren = numberOfChildren,
        this.description = description
    };
};

export default ChildminderRequest;