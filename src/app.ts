import Express from "express";
import "reflect-metadata";
import { connect } from "mongoose";
import { server } from "./apollo";
import config from "./config";

const port : string|number = process.env.PORT || 5000;

const main = async () => {
    // create mongoose connection
    const mongoose = await connect(config.mongoose.databaseUrl, config.mongoose.options);
    await mongoose.connection;

    const app = Express();
    const apollo = await server();

    apollo.applyMiddleware({app});
    app.listen({ port }, () =>
        console.log(`🚀 Server ready and listening at ==> http://localhost:${port}${apollo.graphqlPath}`))
};

main().catch((error)=>{
    console.log(error, 'error');
})
