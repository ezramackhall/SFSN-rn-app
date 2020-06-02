class User {
    constructor(id, email, firstName, lastName, address, postalCode, country, province, city, isNanny, isAdmin){
        this.id = id;
        this.email = email;
        this.firstName = firstName,
        this.lastName = lastName,
        this.address = address,
        this.postalCode = postalCode,
        this.country = country,
        this.province = province,
        this.city = city,
        this.isNanny = isNanny,
        this.isAdmin = isAdmin
    }
}

export default User; 