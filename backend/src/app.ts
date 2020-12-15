import Express from "express";
import path from "path";
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

    // Serve static files from the React app
    app.use(Express.static(path.join(__dirname, '../../build')));
    
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build/index.html'));
    });

    app.listen({ port }, () =>
        console.log(`🚀 Server ready and listening at ==> http://localhost:${port}`));
};

main().catch((error)=>{
    console.log(error, 'error');
})
