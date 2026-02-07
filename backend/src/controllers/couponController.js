const Coupon = require('../models/Coupon');
const AppError = require('../utils/AppError');

const createCoupon = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, minOrderValue, validUntil } = req.body;
        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minOrderValue,
            validUntil,
            companyId: req.user.companyId
        });
        res.status(201).json(coupon);
    } catch (error) {
        next(error);
    }
};

const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({ companyId: req.user.companyId });
        res.json(coupons);
    } catch (error) {
        next(error);
    }
};

const applyCoupon = async (req, res, next) => {
    try {
        const { code, orderValue } = req.body;
        const coupon = await Coupon.findOne({ code, companyId: req.user.companyId, isActive: true });
        
        if (!coupon) throw new AppError('Invalid Coupon', 400);
        
        if (coupon.validUntil && new Date() > coupon.validUntil) {
            throw new AppError('Coupon Expired', 400);
        }

        if (orderValue < coupon.minOrderValue) {
            throw new AppError(`Minimum order value of ${coupon.minOrderValue} required`, 400);
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (orderValue * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        res.json({ valid: true, discount, finalAmount: orderValue - discount });
    } catch (error) {
        next(error);
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
        if (!coupon) throw new AppError('Coupon not found', 404);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCoupon, getCoupons, applyCoupon, deleteCoupon };
