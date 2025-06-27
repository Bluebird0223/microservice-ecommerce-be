
const redisClient = require('../DB/redis.client');
const cartModel = require('../models/cart.model');
const { cartSchema } = require('../schemas/cartSchema');

// Controller for creating a user
exports.addToCart = async (req, res, next) => {
    try {

        const userId = 'admin';
        const incomingItem = req.body;

        const cartKey = `cart:${userId}`;
        let cart = [];

        const existing = await redisClient.get(cartKey);
        if (existing) cart = JSON.parse(existing);

        // Add or update product
        const index = cart.findIndex(i => i.productId === incomingItem.productId);
        if (index !== -1) {
            cart[index].quantity += incomingItem.quantity;
        } else {
            cart.push(incomingItem);
        }

        // Update Redis
        await redisClient.set(cartKey, JSON.stringify(cart));


        // ✅ Validate full cart structure before saving to DynamoDB
        const { error, value } = cartSchema.validate(incomingItem, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message),
            });
        }

        // Save to DynamoDB
        const savedCart = await cartModel.createCart(value);

        return res.status(200).json({
            message: 'Item added to cart and saved in DB',
            cart: savedCart
        });

    } catch (error) {
        console.error('Error in cartController.js - addToCart:', error);
        next(error);
    }
};

// Controller for getting all cart
exports.getCart = async (req, res, next) => {
    try {
        // const { userId } = req
        let userId = '685c161es0'
        const cartKey = `cart:${userId}`;

        // Check Redis first
        let cachedCart = await redisClient.get(cartKey);
        if (cachedCart) {
            return res.status(200).json({
                message: 'Cart retrieved from Redis',
                cart: JSON.parse(cachedCart)
            });
        }

        // Fallback to DynamoDB
        const cartFromDb = await cartModel.getCartByUserId(userId);
        if (!cartFromDb) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Cache it back in Redis
        await redisClient.set(cartKey, JSON.stringify(cartFromDb));

        res.status(200).json({
            message: 'Cart retrieved from DynamoDB',
            cart: cartFromDb
        });
    } catch (err) {
        console.error('getCart error:', err);
        next(err);
    }
};

// Controller for updating a cart
exports.updateCart = async (req, res, next) => {
    try {
        const userId = "685c161es0"
        const updatedCartItems = req.body;
        const cleanedCartItems = updatedCartItems.filter(item => item.quantity > 0);

        // Validate entire cart
        const { error, value } = cartSchema.validate(cleanedCartItems, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(e => e.message)
            });
        }

        // Save to Redis
        const redisKey = `cart:${userId}`;
        await redisClient.set(redisKey, JSON.stringify(value));

        // Save to DynamoDB
        const updated = await cartModel.updateCart(userId, value.cartItems);

        res.status(200).json({
            message: 'Cart updated successfully',
            cart: updated
        });

    } catch (err) {
        console.error('updateCart error:', err);
        next(err);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const userId = "685c161es0"; // Ideally from req.user.userId or JWT
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const redisKey = `cart:${userId}`;
        let cart = [];

        // Get from Redis
        const redisCart = await redisClient.get(redisKey);
        if (redisCart) {
            cart = JSON.parse(redisCart);
        } else {
            // Fallback to DB if Redis empty
            const dbCart = await cartModel.getCartByUserId(userId);
            if (dbCart) cart = dbCart.cartItems;
        }

        // Remove the item
        const filteredCart = cart.filter(item => item.productId !== productId);

        // Update Redis
        await redisClient.set(redisKey, JSON.stringify(filteredCart));

        // Update DynamoDB
        const updated = await cartModel.updateCart(userId, filteredCart);

        return res.status(200).json({
            message: `Product ${productId} removed from cart`,
            cart: updated
        });

    } catch (err) {
        console.error("removeFromCart error:", err);
        next(err);
    }
};