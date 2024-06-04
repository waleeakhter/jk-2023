import AdminSchema from '@/models/Admin';

export const seedAdmin = async () => {
    const admin = { firstName: 'Admin', lastName: 'Admin', email: 'admin@gmail.com', password: 'admin123' };

    let count = await AdminSchema.countDocuments({})

    console.log('Number of Admin:', count);

    if (count === 0) {
        console.log('Admin Created successfully');
        await AdminSchema.create(admin)
    }
}

