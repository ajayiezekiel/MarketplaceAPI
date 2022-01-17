import { Request, Response, NextFunction } from 'express';

interface PaginationInt {
    page: number;
    limit: number;
};

interface AbstractedRes {
    success: boolean;
    count: number;
    pagination?: {next?: PaginationInt, prev?: PaginationInt}
    data: any
};


interface customResponse extends Response {
    abstractedResults?: AbstractedRes
};

const abstractedResults = (model: any, populate?: string | { path: string, select: string }) => async (req: Request, res: customResponse, next: NextFunction) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removedLists: string[] = ['limit', 'select', 'sort', 'page']   

    // Loop over removeFields and delete them from reqQuery
    removedLists.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding Resource
    query = model.find(JSON.parse(queryStr));

    // Select Fields
    if(req.query.select){
        const fields = (req.query.select as string).split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const fields = (req.query.sort as string).split(',').join(' ');
        query = query.sort(fields);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt((req.query.page as string), 10) || 1;
    const limit = parseInt((req.query.limit as string), 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if(populate) {
        query = query.populate(populate);
    }

    // Executing query
    const results = await query;

    const pagination: {next?: PaginationInt, prev?: PaginationInt} = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    

    res.abstractedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();
};

export default abstractedResults;