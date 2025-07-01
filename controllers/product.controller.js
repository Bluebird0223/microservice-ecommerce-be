

const productModel = require('../models/product.model');
const productSchema = require('../schemas/productSchema');
const deleteFromS3 = require('../utils/helper/delete-image-s3');
const uploadProfilePictureToS3 = require('../utils/helper/upload-image-to-s3');
const runMiddleware = require('../utils/middleware/multer-middleware');
const uploadSingleImage = require('../utils/multer/upload-image');
const S3_PRODUCT_IMAGE_FOLDER = process.env.S3_PRODUCT_IMAGE_FOLDER

// Controller for creating a product
exports.createProduct = async (req, res, next) => {
    try {

        const { userId, userType } = req

        // upload file
        const fileResponse = await runMiddleware(req, res, uploadSingleImage.single('productPicture'));
        if (fileResponse) {
            return res.status(200).json({
                status: "FAILED",
                message: fileResponse?.code
            });
        }

        // check if the file is attached
        if (!req.file) {
            return res.status(200).json({
                status: "FAILED",
                message: "File is required."
            });
        }

        // check file size 
        const sizeLimit = 2000000; // 2MB limit
        const attachedFile = req?.file;

        // Check if the file exists, is an image or pdf, and exceeds the size limit
        if (attachedFile?.mimetype?.startsWith("image/") && attachedFile?.size >= sizeLimit) {
            return res.status(200).json({
                status: "FAILED",
                message: `${attachedFile?.originalname} exceeds the 2MB size limit`
            });
        }


        // Extract data from request body
        const data = JSON.parse(req.body.data);
        const productData = data;

        // check user is admin
        if (userType !== 'admin') {
            return res.status(400).json({
                status: "FAILED",
                message: "User is not authorized for this action"
            });
        }

        // Validate incoming JSON data first (excluding file data for now)
        const { error, value } = productSchema.validate(productData, { abortEarly: false, stripUnknown: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        //check if product already exist 
        const existingProductByName = await productModel.getProductByName(value?.productName);
        if (existingProductByName) {
            return res.status(409).json({ // 409 Conflict is appropriate for resource conflict
                status: "FAILED",
                message: "Product with this name already exists. Please use a different name."
            });
        }

        // Handle file upload if present
        if (req.file) {
            productPictureUrl = await uploadProfilePictureToS3(S3_PRODUCT_IMAGE_FOLDER, req.file.buffer, req.file.mimetype);
            value.productPicture = productPictureUrl;
        } else {
            value.productPicture = null; // Ensure profilePicture is null if no file uploaded
        }

        // Create the product in DynamoDB via the model
        const newProduct = await productModel.createProduct(value, userId);

        res.status(201).json({
            message: 'Product created successfully',
            newProduct
        });
    } catch (error) {
        console.error("Error in productController.js - createProduct:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// Controller for getting all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json({
            message: 'Product retrieved successfully',
            products
        });
    } catch (error) {
        console.error("Error in productController.js - getAllProduct:", error);
        next(error); // Pass error to the error handling middleware
    }
};


exports.getProductById = async (req, res, next) => {
    try {
        const { productId } = req.body;
        // Fetch existing product
        const existingProduct = await productModel.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json({
            message: 'Product retrieved successfully',
            existingProduct
        });

    } catch (error) {
        console.error("Error in productController.js - getProductById:", error);
        next(error);
    }
}

// Controller for updating a user
exports.updateProduct = async (req, res, next) => {
    try {

        let isFileAttached = req?.query?.isFileAttached;
        let data;

        // Upload documents if a file is attached
        if (isFileAttached === "true") {
            const fileResponse = await runMiddleware(req, res, uploadSingleImage.single('productPicture'));
            if (fileResponse) {
                return res.status(200).json({
                    status: "FAILED",
                    message: fileResponse.code
                });
            }
            data = JSON.parse(req.body.data);
        } else {
            data = req.body;
        }

        // Set the file size limit
        const sizeLimit = 2000000; // 2MB limit
        const attachedFile = req?.file;

        // Check if the file is an image or pdf, and exceeds the size limit
        if (attachedFile?.mimetype?.startsWith("image/") && attachedFile?.size >= sizeLimit) {
            return res.status(200).json({
                status: "FAILED",
                message: `${attachedFile?.originalname} exceeds the 2MB size limit`
            });
        }

        // Validate product data using Joi
        const { error, value } = productSchema.validate(data, { abortEarly: false, stripUnknown: true });

        if (error) {
            return res.status(400).json({
                status: "FAILED",
                message: 'Validation Error',
                details: error.details.map(x => x.message),
            });
        }

        // Fetch existing user
        const existingUser = await productModel.getProductById(data?.productId);
        if (!existingUser) {
            return res.status(404).json({ message: 'Product not found' });
        }


        if (attachedFile) {
            if (existingUser.productPicture) {
                await deleteFromS3(existingUser.productPicture);
            }
            const profilePictureUrl = await uploadProfilePictureToS3('product-images/', attachedFile.buffer, attachedFile.mimetype);
            value.productPicture = profilePictureUrl;
        }

        // Update product
        value.updatedAt = new Date().toISOString();

        const updatedProduct = await productModel.updateProduct(value);

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        console.error("Error in productController.js - updateProduct:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({
                message: 'Product ID is required in URL parameters to delete a product.',
            });
        }

        // check if product exist
        const isProductExist = await productModel.getProductById(productId)
        if (!isProductExist) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // delete product image
        if (isProductExist?.productPicture) {
            await deleteFromS3(isProductExist.productPicture);
        }

        const deletedItem = await productModel.deleteProduct(productId);
        if (!deletedItem) {
            // If deletedItem is null or empty, it means no item was found with that ID
            return res.status(404).json({
                message: `Product with ID '${productId}' not found.`,
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            deletedProduct: deletedItem
        });


    } catch (error) {
        console.error("Error in productController.js - deleteProduct:", error);
        next(error); // Pass error to the error handling middleware
    }
}