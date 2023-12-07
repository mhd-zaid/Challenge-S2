export default (
    Product,
    Model,
    Brand,
    Category,
    Product_Images,
    ProductMongodb,
    ObjectId,
    Op
) => {
    const addFiltersToQuery = (queries, filters) => {
        const {query, modelQuery, brandQuery, categoryQuery} = queries;
        if (filters.maxPrice) {
            query.price = {
                [Op.lte]: filters.maxPrice * 100,
            };
        }
        if (filters.minPrice) {
            query.price = {
                [Op.gte]: filters.minPrice * 100,
            };
        }
        if (filters.color) {
            const colors = filters.color.split(",");
            query.color = {
                [Op.or]: colors.map((color) => ({[Op.iLike]: color})),
            };
        }
        if (filters.size) {
            const sizes = filters.size.split(",");
            query.size = {
                [Op.or]: sizes.map((size) => ({[Op.iLike]: size})),
            };
        }
        if (filters.gender) {
            const genders = filters.gender.split(",");
            modelQuery.gender = {
                [Op.or]: genders.map((gender) => ({[Op.iLike]: gender})),
            };
        }
        if (filters.brand) {
            const brands = filters.brand.split(",");
            brandQuery.name = {
                [Op.or]: brands.map((brand) => ({[Op.iLike]: brand})),
            };
        }
        if (filters.category) {
            const categories = filters.category.split(",");
            categoryQuery.name = {
                [Op.or]: categories.map((category) => ({
                    [Op.iLike]: category,
                })),
            };
        }
        if (filters.discount) {
            query.discount = {
                [Op.ne]: null || 0,
            };
        }
    };

    const getProducts = async (req, res) => {
        try {
            const query = {};
            const modelQuery = {};
            const brandQuery = {};
            const categoryQuery = {};
            const filters = req.query;
            const page = filters.page || 1;
            const limit = filters.limit || filters.page ? 12 : null;
            addFiltersToQuery(
                {query, modelQuery, brandQuery, categoryQuery},
                filters
            );

            const offset = (page - 1) * limit;

            const totalProducts = await Product.count({
                include: [
                    {
                        model: Model,
                        as: "model",
                        where: modelQuery,
                        include: [
                            {
                                model: Brand,
                                as: "brand",
                                where: brandQuery,
                            },
                            {
                                model: Category,
                                as: "category",
                                where: categoryQuery,
                            },
                        ],
                    },
                ],
                where: query,
            });

            const productsOptions = {
                include: [
                    {
                        model: Model,
                        as: "model",
                        where: modelQuery,
                        include: [
                            {
                                model: Brand,
                                as: "brand",
                                where: brandQuery,
                            },
                            {
                                model: Category,
                                as: "category",
                                where: categoryQuery,
                            },
                        ],
                    },
                    "productImages",
                ],
                where: query,
                offset: offset,
            };

            if (limit !== null) {
                productsOptions.limit = parseInt(limit);
            }

            const products = await Product.findAll(productsOptions);

            res.status(200).json({
                totalProducts,
                products: products.map((product) => ({
                    ...product.dataValues,
                    price: (product.dataValues.price / 100).toFixed(2),
                })),
            });
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the products : ${error.message}`,
            });
        }
    };

    const createProduct = async (req, res) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({message: "name is missing"});
            }
            if (!req.body.price) {
                return res.status(400).json({message: "price is missing"});
            }
            if (!req.body.vat) {
                return res.status(400).json({message: "vat is missing"});
            }
            if (!req.body.quantity) {
                return res.status(400).json({message: "quantity is missing"});
            }
            if (!req.body.size) {
                return res.status(400).json({message: "size is missing"});
            }
            if (!req.body.color) {
                return res.status(400).json({message: "color is missing"});
            }
            if (!req.body.sku) {
                return res.status(400).json({message: "sku is missing"});
            }
            if (!req.body.modelId) {
                return res.status(400).json({message: "modelId is missing"});
            }

            const model = await Model.findOne({

                    where: {id: req.body.modelId},
                    include: ["brand", "category"],
                }
            );

            if (!model) {
                return res.status(404).json({message: "Model not found"});
            }

            const id = new ObjectId();

            const productDataToCreate = {
                name: req.body.name,
                price: req.body.price * 100,
                vat: req.body.vat,
                quantity: req.body.quantity,
                size: req.body.size,
                color: req.body.color,
                discount: req.body.discount,
                alertQuantity: req.body.alertQuantity,
                sku: req.body.sku,
                modelId: model.id,
            };
            const product = await Product.create({
                id: id.toString(),
                ...productDataToCreate,
            });

            productDataToCreate._id = id;
            productDataToCreate.brand = model.brand.toJSON();
            productDataToCreate.category = model.category.toJSON();
            productDataToCreate.model = model.toJSON();
            productDataToCreate.deletedAt = null;
            await ProductMongodb(productDataToCreate).save();

            res.status(201).json(product);
        } catch (error) {
            if (
				error.name == "SequelizeValidationError" ||
				error.name == "SequelizeUniqueConstraintError"
			) {
                return res.status(422).json({message: error.message});
            } else {
                return res.status(500).json({
                    message: `An error occurred while creating the product : ${error.message}`,
                });
            }
        }
    };

    const updateProduct = async (req, res) => {
        try {
            const {id} = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({message: "Id parameter is missing"});
            }

            switch (req.body) {
                case !req.body.name:
                    return res.status(400).json({message: "name is missing"});
                case !req.body.price:
                    return res
                        .status(400)
                        .json({message: "price is missing"});
                case !req.body.vat:
                    return res.status(400).json({message: "vat is missing"});
                case !req.body.quantity:
                    return res
                        .status(400)
                        .json({message: "quantity is missing"});
                case !req.body.size:
                    return res.status(400).json({message: "size is missing"});
                case !req.body.color:
                    return res
                        .status(400)
                        .json({message: "color is missing"});
                case !req.body.sku:
                    return res.status(400).json({message: "sku is missing"});
                case !req.body.modelId:
                    return res
                        .status(400)
                        .json({message: "modelId is missing"});
            }

            const model = await Model.findOne({
                    where: {id: req.body.modelId},
                    include: ["brand", "category"],
                }
            );

            if (!model) {
                return res.status(404).json({message: "Model not found"});
            }

            const productDataToUpdate = {
                name: req.body.name,
                price: req.body.price * 100,
                vat: req.body.vat,
                quantity: req.body.quantity,
                size: req.body.size,
                color: req.body.color,
                discount: req.body.discount,
                alertQuantity: req.body.alertQuantity,
                sku: req.body.sku,
                modelId: model.id,
            };

            const product = await Product.findOne({
                where: {id},
            });

            if (!product)
                return res.status(404).json({message: "Product not found"});

            const productMongo = await ProductMongodb.findOne({
                _id: new ObjectId(id),
            });

            await product.update(req.body);
            productDataToUpdate.model = model.toJSON();
            productDataToUpdate.brand = model.brand.toJSON();
            productDataToUpdate.category = model.category.toJSON();

            await productMongo.updateOne(productDataToUpdate);

            res.status(200).json({message: "Product updated successfully"});
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                return res.status(422).json({message: error.message});
            } else {
                return res.status(500).json({
                    message: `An error occurred while updating the product : ${error.message}`,
                });
            }
        }
    };

    const deleteProduct = async (req, res) => {
        try {
            const {id} = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({message: "Id parameter is missing"});
            }

            const product = await Product.findOne({where: {id}});

            if (!product)
                return res.status(404).json({message: "Product not found"});

            const productMongo = await ProductMongodb.findOne({
                _id: new ObjectId(id),
            });

            await product.destroy();
            await productMongo.updateOne({deletedAt: Date.now()});

            res.status(204).json({message: "Product deleted successfully"});
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while deleting the product : ${error.message}`,
            });
        }
    };

    const getProduct = async (req, res) => {
        try {
            const {id} = req.params;

            if (!id) {
                return res
                    .status(400)
                    .json({message: "Id parameter is missing"});
            }

            const product = await Product.findOne({
                where: {id},
                include: ["model", "productImages"],
            });

            if (!product)
                return res.status(404).json({message: "Product not found"});

            product.price = (product.price / 100).toFixed(2);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the product : ${error.message}`,
            });
        }
    };

    const uploadImage = async (req, res) => {
        console.log(req.files)
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({message: "Id parameter is missing"});
            }
            if (req.files.length === 0) {
                return res.status(400).json({message: "No file uploaded"});
            }
            const images = req.files.map((file) => file.filename);
            for (const image of images) {
                await Product_Images.create({url: image, ProductId: id});
            }
            res.sendStatus(201);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while uploading the images : ${error.message}`,
            });
        }
    };

    return {
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        uploadImage,
    };
};
