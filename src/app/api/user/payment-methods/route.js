import dbConnection from '@/app/lib/db';
import User from '@/app/models/User';
import mongoose from 'mongoose';

// ADD payment method
export async function POST(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { email, type, cardNumber, cardHolder, expiryMonth, expiryYear, cardBrand, upiId, walletProvider, walletId, isDefault } = body;

    if (!email || !type) {
      return Response.json({ error: 'Email and payment type are required' }, { status: 400 });
    }

    // Validate card details for credit/debit cards
    if ((type === 'credit_card' || type === 'debit_card') && !cardNumber) {
      return Response.json({ error: 'Card number is required for cards' }, { status: 400 });
    }

    // Validate UPI
    if (type === 'upi' && !upiId) {
      return Response.json({ error: 'UPI ID is required' }, { status: 400 });
    }

    const newPaymentMethod = {
      _id: new mongoose.Types.ObjectId(),
      type,
      ...(cardNumber && { cardNumber }),
      ...(cardHolder && { cardHolder }),
      ...(expiryMonth && { expiryMonth }),
      ...(expiryYear && { expiryYear }),
      ...(cardBrand && { cardBrand }),
      ...(upiId && { upiId }),
      ...(walletProvider && { walletProvider }),
      ...(walletId && { walletId }),
      isDefault: isDefault || false,
      isActive: true,
      createdAt: new Date(),
    };

    // If isDefault is true, remove default from other payment methods
    if (isDefault) {
      await User.updateOne(
        { email },
        { $set: { 'paymentMethods.$[].isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $push: { paymentMethods: newPaymentMethod } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user, message: 'Payment method added successfully' }, { status: 201 });
  } catch (err) {
    console.error('Payment method add error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE payment method
export async function PUT(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { email, paymentMethodId, isDefault, isActive } = body;

    if (!email || !paymentMethodId) {
      return Response.json({ error: 'Email and payment method ID are required' }, { status: 400 });
    }

    const updateData = {};
    if (isDefault !== undefined) updateData['paymentMethods.$.isDefault'] = isDefault;
    if (isActive !== undefined) updateData['paymentMethods.$.isActive'] = isActive;

    // If setting as default, remove default from other payment methods
    if (isDefault) {
      await User.updateOne(
        { email },
        { $set: { 'paymentMethods.$[].isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { email, 'paymentMethods._id': new mongoose.Types.ObjectId(paymentMethodId) },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return Response.json({ error: 'User or payment method not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user, message: 'Payment method updated successfully' });
  } catch (err) {
    console.error('Payment method update error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE payment method
export async function DELETE(req) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const paymentMethodId = searchParams.get('paymentMethodId');

    if (!email || !paymentMethodId) {
      return Response.json({ error: 'Email and payment method ID are required' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { paymentMethods: { _id: new mongoose.Types.ObjectId(paymentMethodId) } } },
      { new: true }
    ).select('-password');

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user, message: 'Payment method deleted successfully' });
  } catch (err) {
    console.error('Payment method delete error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
