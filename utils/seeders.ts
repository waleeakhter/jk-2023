import AdminSchema from '@/models/Admin';
import ItemTypeSchema from '@/models/ItemType';

export const seedAdmin = async () => {
    const admin = { firstName: 'Admin', lastName: 'Admin', email: 'admin@gmail.com', password: 'admin123' };

    let count = await AdminSchema.countDocuments({})

    console.log('Number of Admin:', count);

    if (count === 0) {
        console.log('Admin Created successfully');
        await AdminSchema.create(admin)
    }
}

export const seedType = async () => {
    const itemType = [{ name: 'Mobile' }, { name: 'Lcd' }];

    let count = await ItemTypeSchema.countDocuments({})

    console.log('Number of Categories:', count);

    if (count === 0) {
        const types = await ItemTypeSchema.insertMany(itemType)
        console.log(`${types.length} documents were inserted`);
    }
};
