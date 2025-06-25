// // controllers/userController.js
const userModel = require('../models/user.model');
const userSchema = require('../schemas/usersSchema');
const deleteFromS3 = require('../utils/helper/delete-image-s3');
const uploadProfilePictureToS3 = require('../utils/helper/upload-image-to-s3');
const S3_PROFILE_PICTURE_FOLDER = process.env.S3_PROFILE_PICTURE_FOLDER || 'profile-pictures/';
const runMiddleware = require('../utils/middleware/multer-middleware');
const uploadSingleImage = require('../utils/multer/upload-image');
const generateUserJWT=require('../utils/middleware/generate.token')
// Controller for creating a user
const createUser = async (req, res, next) => {
    try {

        // upload file
        const fileResponse = await runMiddleware(req, res, uploadSingleImage.single('profilePicture'));
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
            await deleteSingleFile(req?.file)
            return res.status(200).json({
                status: "FAILED",
                message: `${attachedFile?.originalname} exceeds the 2MB size limit`
            });
        }


        // Extract data from request body
        const data = JSON.parse(req.body.data);
        const userData = data;


        // Validate incoming JSON data first (excluding file data for now)
        const { error, value } = userSchema.validate(userData, { abortEarly: false, stripUnknown: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        //check if user already exist 
        const existingUserByEmail = await userModel.getUserByEmail(value.email);
        if (existingUserByEmail) {
            return res.status(409).json({ // 409 Conflict is appropriate for resource conflict
                status: "FAILED",
                message: "User with this email already exists. Please use a different email."
            });
        }

        // Handle file upload if present
        if (req.file) {
            profilePictureUrl = await uploadProfilePictureToS3(S3_PROFILE_PICTURE_FOLDER, req.file.buffer, req.file.mimetype);
            value.profilePicture = profilePictureUrl;
        } else {
            value.profilePicture = null; // Ensure profilePicture is null if no file uploaded
        }

        // Create the user in DynamoDB via the model
        const newUser = await userModel.createUser(value);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error("Error in userController.js - createUser:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// Controller for getting all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json({
            message: 'Users retrieved successfully',
            users: users.map(user => ({
                ...user,
                profilePicture: user.profilePicture || null // Ensure it's null if not set
            }))
        });
    } catch (error) {
        console.error("Error in userController.js - getAllUsers:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// Controller for updating a user
const updateUser = async (req, res, next) => {
    try {

        let isFileAttached = req?.query?.isFileAttached;
        let data;

        // Upload documents if a file is attached
        if (isFileAttached === "true") {
            const fileResponse = await runMiddleware(req, res, uploadSingleImage.single('profilePicture'));
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

        // const updateData = data;

        // Validate user data using Joi
        const { error, value } = userSchema.validate(data, { abortEarly: false, stripUnknown: true });

        if (error) {
            return res.status(400).json({
                status: "FAILED",
                message: 'Validation Error',
                details: error.details.map(x => x.message),
            });
        }

        // Fetch existing user
        const existingUser = await userModel.getUserById(data?.userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }


        if (attachedFile) {
            if (existingUser.profilePicture) {
                await deleteFromS3(existingUser.profilePicture);
            }

            const profilePictureUrl = await uploadProfilePictureToS3('profile-pictures/', attachedFile.buffer, attachedFile.mimetype);

            value.profilePicture = profilePictureUrl;
        }

        // Update user
        value.updatedAt = new Date().toISOString();

        const updatedUser = await userModel.updateUser(data?.userId, value);

        return res.status(200).json({
            status: "SUCCESS",
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in userController.js - updateUser:", error);
        next(error); // Pass error to the error handling middleware
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.body;
        // Fetch existing user
        const existingUser = await userModel.getUserById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User retrieved successfully',
            existingUser
        });

    } catch (error) {
        console.error("Error in userController.js - getUserById:", error);
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {

        //Extract data from request body
        const { userName, password } = req.body;

        // Validate incoming JSON data first (excluding file data for now)
        const { error, value } = userSchema.validate(req.body, { abortEarly: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        //check if user exist 
        const existingUserByName = await userModel.getUserByName(userName);
        if (!existingUserByName) {
            return res.status(400).json({ // 409 Conflict is appropriate for resource conflict
                status: "FAILED",
                message: "User does not exist"
            });
        }

        // check if user admin
        if (existingUserByName?.userType !== "admin") {
            return res.status(200).json({
                status: "FAILED",
                message: "User is not admin"
            })
        }

        //compare password with password in database
        if (password === existingUserByName?.password) {
            const userDetails = {
                userId: existingUserByName?.userId,
                username: existingUserByName?.username,
                userType: existingUserByName?.userType,
                email: existingUserByName?.email,
                bio: existingUserByName?.bio,
                // employeeGroup: isUserExist?.employee_group,
                // tabAccess: isUserExist?.tabAccess
            }
            const token = generateUserJWT(userDetails)
            if (token) {
                return res.status(200).json({
                    status: "SUCCESS",
                    message: "Login Successfully",
                    token,
                    userDetails,
                })
            }
        } else {
            return res.status(200).json({
                status: "FAILED",
                message: "Incorrect credential!, check your id or password.",
            });
        }

    } catch (error) {
        console.error("Error in userController.js - login:", error);
        next(error);
    }

}

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    loginUser
};