const mongoose = require('mongoose');

const connectDB = async () => {

    await mongoose.connect(
        "mongodb+srv://mamu:Mamu%40180821@mamu.hwlvsq4.mongodb.net/devTinder"
    )
}

module.exports = connectDB