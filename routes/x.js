// post /api/return {customerId, movieId}

// return 401 if customer is not logged in
// return 400 if customer id is not provided
// return 400 if movie id is not provided
// return 404 if no rental is found for movie or customer
// return 400 if rental is already processed

// return 200 if valid request
// set valid returned date
// calculate the rental fee
// increase stock quantity
// return rental
