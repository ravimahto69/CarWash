import dbConnection from '@/app/lib/db';
import User from '@/app/models/User';
import mongoose from 'mongoose';

// ADD address
export async function POST(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { email, label, street, city, state, zipCode, country, isDefault } = body;

    if (!email || !street || !city || !state || !zipCode) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      label: label || 'home',
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault: isDefault || false,
      createdAt: new Date(),
    };

    // If isDefault is true, remove default from other addresses
    if (isDefault) {
      await User.updateOne(
        { email },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $push: { addresses: newAddress } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user, message: 'Address added successfully' }, { status: 201 });
  } catch (err) {
    console.error('Address add error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE address
export async function PUT(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { email, addressId, label, street, city, state, zipCode, country, isDefault } = body;

    if (!email || !addressId) {
      return Response.json({ error: 'Email and address ID are required' }, { status: 400 });
    }

    const updateData = {};
    if (label) updateData['addresses.$.label'] = label;
    if (street) updateData['addresses.$.street'] = street;
    if (city) updateData['addresses.$.city'] = city;
    if (state) updateData['addresses.$.state'] = state;
    if (zipCode) updateData['addresses.$.zipCode'] = zipCode;
    if (country) updateData['addresses.$.country'] = country;
    if (isDefault !== undefined) updateData['addresses.$.isDefault'] = isDefault;

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await User.updateOne(
        { email },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const user = await User.findOneAndUpdate(
      { email, 'addresses._id': new mongoose.Types.ObjectId(addressId) },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return Response.json({ error: 'User or address not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user, message: 'Address updated successfully' });
  } catch (err) {
    console.error('Address update error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE address
export async function DELETE(req) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const addressId = searchParams.get('addressId');

    if (!email || !addressId) {
      return Response.json({ error: 'Email and address ID are required' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { addresses: { _id: new mongoose.Types.ObjectId(addressId) } } },
      { new: true }
    ).select('-password');

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user, message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Address delete error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
