const Medicine = require("../models/medicine");
const User = require("../models/User");


module.exports.getall = async function (req, res) {
    try {

        if (!req.user) {
            return res.status(401).json({
                message: 'unable to find user',
                success: false,
            });
        }

        const user = await User.findById(req.user._id)?.populate('medicines');

        if (!user) {
            return res.status(401).json({
                message: 'unable to find user',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'medicines fetched successfully',
            user,
            success: true,
        })

    } catch (error) {
        console.log(`error in getting all medicine`);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
    }
}

module.exports.create = async function (req, res) {
    try {

        const { name, dosage, schedule, notes } = req.body;

        if (!req.user) {
            return res.status(401).json({
                message: 'unable to find user',
                success: false,
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                message: 'unable to find user',
                success: false,
            });
        }

        const medicine = await Medicine.create({
            name,
            dosage,
            schedule,
            notes,
        })

        user.medicines.push(medicine._id);
        await user.save();

        return res.status(200).json({
            message: 'medicine added successfully',
            success: true,
        })

    } catch (error) {
        console.log(`error in creating medicine`);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
    }

}

module.exports.detele = async function (req, res) {

    try {
        const medicineId = req.params.id;

        if (!medicineId) {
            return res.status(400).json({
                message: 'empty medicine id recieved',
                success: false
            })
        }
        const user = await User.findById(req.user.id);
        const newMedicines = user.medicines.filter((item) => item != medicineId);
        user.medicines = newMedicines;
        user.save();

        await Medicine.findByIdAndDelete(medicineId);

        return res.status(200).json({
            message: 'medicine removed successfully',
            success: true,
        })

    } catch (error) {
        console.log(`error in deleting medicine`);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
    }


}