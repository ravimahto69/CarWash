import dbConnection from '@/app/lib/db';
import User from '@/app/models/User';

// GET user profile
export async function GET(req) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE user profile
export async function PUT(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { email, name, phone, bio, preferences } = body;

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const updateData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(bio && { bio }),
      ...(preferences && { preferences }),
    };

    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  } catch (err) {
    console.error('Profile update error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
