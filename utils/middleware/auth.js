const jsonWebToken = require("jsonwebtoken");
const userService = require("../../services/user.service");

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
                    request._id = userDetails?._id;
                    const isUserExist = await userService.getEmployeeByObjectId(userDetails?._id);
                    if (!isUserExist) {
                        return response.status(200).json({
                            status: "JWT_INVALID",
                            message: "Your session has ended, Please login again.",
                        });
                    };

                    // data to pass in request object
                    request.userId = isUserExist?.userId;
                    request.name = isUserExist?.name;
                    request.designation = isUserExist?.designation;
                    request.employeeGroup = isUserExist?.employee_group;
                    request.tabAccess = isUserExist?.tabAccess;
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