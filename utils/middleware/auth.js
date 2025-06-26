const jsonWebToken = require("jsonwebtoken");
const userModel = require('../../models/user.model');

const userAuthentication = async (request, response, next) => {
    try {
        // Authorization header
        const authHeader = request?.header("authorization");
        if (authHeader) {
            const token = authHeader.split(" ")[1];

            // Verify the JWT token
            jsonWebToken?.verify(token, process.env.JWT_SECRET_KEY, async (error, userDetails) => {
                if (error) {
                    return response.status(200).json({
                        status: "JWT_INVALID",
                        message: "Your session has ended, Please login again."
                    });
                } else {

                    // If the token is valid, check if the user exists in the database
                    request.userId = userDetails?.userId;
                    const isUserExist = await userModel.getUserById(userDetails?.userId);
                    if (!isUserExist) {
                        return response.status(200).json({
                            status: "JWT_INVALID",
                            message: "Your session has ended, Please login again.",
                        });
                    };

                    // data to pass in request object
                    request.userId = isUserExist?.userId;
                    request.username = isUserExist?.username;
                    request.userType = isUserExist?.userType;
                    request.email = isUserExist?.email;
                    request.bio = isUserExist?.bio;
                    // request.email = isUserExist?.email;
                    // request.mobile = isUserExist?.mobile;
                    // request.tabAccess = isUserExist?.tabAccess;
                    // request.userType = isUserExist?.userType;
                    // request.departmentId = isUserExist?.departmentId;
                    // request.tabAccess = isUserExist?.tabAccess;
                }
                next();
            })
        } else {
            return response.status(200).json({
                status: "JWT_INVALID",
                message: "Your session has ended, Please login again."
            });
        }
    } catch (error) {
        return response.status(200).json({
            status: "FAILED",
            message: error.message
        })
    }
}

module.exports = userAuthentication;