class APIfeature {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page','sort','fields','limit'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){
        if (this.queryString.sort) {
            console.log(this.queryString.sort);
            const SortBy = this.queryString.sort.split(',').join(' ');
            console.log('Sort By:', SortBy);  // Kiểm tra giá trị của SortBy
            this.query = this.query.sort(SortBy);
        }
        return this;
    }

    limitfields(){
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIfeature;