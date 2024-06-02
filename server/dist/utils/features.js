import mongoose from "mongoose";
export const connectDB = (mongoURI) => {
    mongoose
        .connect(mongoURI, {
        dbName: "Pasal",
    })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
