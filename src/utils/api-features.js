import { paginationFunction } from "./pagination.js"

export class APIFeatures {
    constructor(query, mongooseQuery) {
        this.query = query 
        this.mongooseQuery = mongooseQuery
    }


    pagination({ page, size }) {
    //  Get all products paginated 
        const { limit, skip } = paginationFunction({ page, size })  
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
        return this
    }


    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') 
        const [key, value] = formula.split(':')
        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }


    filter(filters) {
        const queryFilter = JSON.parse(
            JSON.stringify(filters).replace(
                /gt|gte|lt|lte|in|nin|eq|ne|regex/g,
                (operator) => `$${operator}`,
            ),
        )
        this.mongooseQuery.find(queryFilter)
        return this
    }
}