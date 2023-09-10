class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
// this is the search feature  of the product for showing the selected product
    search(){
        const keyword  = this.queryStr.keyword ? { 
            name: {
                $regex : this.queryStr.keyword,
                $options : "i"
            }
         } : { };


         this.query = this.query.find({...keyword})
         return this;
    }

// this filter is used to filter the product from the databases with different key{category,price,name, etc}    
    filter(){
        const queryCopy = {...this.queryStr}
        

        //Removing some fields for category
        const remmoveFields = ["keyword","page","limit"];

        remmoveFields.forEach(key=>delete queryCopy[key]);

        // Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`);
        
        this.query = this.query.find(JSON.parse(queryStr));

 
        return this;
    }
// this pagination is use to show the numbers of product on the every page
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }

}

module.exports = ApiFeatures;