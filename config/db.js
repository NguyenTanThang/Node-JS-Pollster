const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        console.log(`Database connected on ${conn.connection.host}:${conn.connection.port}`)
        return conn;
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB