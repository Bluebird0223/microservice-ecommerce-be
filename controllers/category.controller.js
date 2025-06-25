
const { categorySchema } = require('../schemas/categorySchema');
const categoryModel = require('../models/category.model');

// Controller for creating a user
const createCategory = async (req, res, next) => {
    try {

        // Extract data from request body
        const categoryName = req.body;

        //Validation
        const { error, value } = categorySchema.validate(categoryName, { abortEarly: false, stripUnknown: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        //check if category already exist 
        const existingCategoryByName = await categoryModel.getCategoryByName(categoryName);
        if (existingCategoryByName) {
            return res.status(409).json({ // 409 Conflict is appropriate for resource conflict
                status: "FAILED",
                message: "Category with this Name already exists. Please use a different Name."
            });
        }

        // Create the category in DynamoDB via the model
        const newCategory = await categoryModel.createCategory(value);

        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (error) {
        console.error("Error in categoryController.js - createCategory:", error);
        next(error);
    }
};

// Controller for getting all category
const getAllCategory = async (req, res, next) => {
    try {
        const categories = await categoryModel.getAllCategory();
        res.status(200).json({
            message: 'Category retrieved successfully',
            categories
        });
    } catch (error) {
        console.error("Error in categoryController.js - getAllCategory:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// // Controller for updating a user
// const updateUser = async (req, res, next) => {
//     try {

//         let isFileAttached = req?.query?.isFileAttached;
//         let data;

//         // Upload documents if a file is attached
//         if (isFileAttached === "true") {
//             const fileResponse = await runMiddleware(req, res, uploadSingleImage.single('profilePicture'));
//             if (fileResponse) {
//                 return res.status(200).json({
//                     status: "FAILED",
//                     message: fileResponse.code
//                 });
//             }
//             data = JSON.parse(req.body.data);
//         } else {
//             data = req.body;
//         }

//         // Set the file size limit
//         const sizeLimit = 2000000; // 2MB limit
//         const attachedFile = req?.file;

//         // Check if the file is an image or pdf, and exceeds the size limit
//         if (attachedFile?.mimetype?.startsWith("image/") && attachedFile?.size >= sizeLimit) {
//             return res.status(200).json({
//                 status: "FAILED",
//                 message: `${attachedFile?.originalname} exceeds the 2MB size limit`
//             });
//         }

//         // const updateData = data;

//         // Validate user data using Joi
//         const { error, value } = userSchema.validate(data, { abortEarly: false, stripUnknown: true });

//         if (error) {
//             return res.status(400).json({
//                 status: "FAILED",
//                 message: 'Validation Error',
//                 details: error.details.map(x => x.message),
//             });
//         }

//         // Fetch existing user
//         const existingUser = await userModel.getUserById(data?.userId);
//         if (!existingUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }


//         if (attachedFile) {
//             if (existingUser.profilePicture) {
//                 await deleteFromS3(existingUser.profilePicture);
//             }

//             const profilePictureUrl = await uploadProfilePictureToS3('profile-pictures/', attachedFile.buffer, attachedFile.mimetype);

//             value.profilePicture = profilePictureUrl;
//         }

//         // Update user
//         value.updatedAt = new Date().toISOString();

//         const updatedUser = await userModel.updateUser(data?.userId, value);

//         return res.status(200).json({
//             status: "SUCCESS",
//             message: "User updated successfully",
//             user: updatedUser,
//         });
//     } catch (error) {
//         console.error("Error in userController.js - updateUser:", error);
//         next(error); // Pass error to the error handling middleware
//     }
// };

// const getUserById = async (req, res, next) => {
//     try {
//         const { userId } = req.body;
//         // Fetch existing user
//         const existingUser = await userModel.getUserById(userId);
//         if (!existingUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({
//             message: 'User retrieved successfully',
//             existingUser
//         });

//     } catch (error) {
//         console.error("Error in userController.js - getUserById:", error);
//         next(error);
//     }
// }

module.exports = {
    createCategory,
    getAllCategory,
    // updateUser,
    // getUserById
};