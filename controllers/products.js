import Product from '../models/product.js';

const getAllProductsStatic = async (req, res) => {
    let products = await Product.find({});
    res.status(200).json(products);
}

const getAllProducts= async (req, res) => {
    let { name, sort, fields, numericFilters } = req.query;

    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => {
            return `-${operatorMap[match]}-`
        });
        console.log(filters);
        const options = ['price', 'rating'];

        filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-');
            if(options.includes(field)){
                req.query[field] = { [operator]: Number(value)}
            }
        })
    }

    if(name) {
        name = {$regex: name, $options: 'i'};
        req.query.name = name;
    }

    // let result = Product.find(name ? {...req.query, name} : req.query);
    let result = Product.find(req.query);

    //sort
    if(sort) {
        console.log(sort);
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    //search for specific fields ie company only
    if(fields){
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit)

    const products = await result;

    res.status(200).json({ products, nbHits: products.length });
}

export { getAllProductsStatic, getAllProducts };

