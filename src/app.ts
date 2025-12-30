import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./di/inversify.config";

import "./controller/test.controller"

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(express.json())
});

export const app = server.build()

app.get("/", (req, res) => {
    res.json({
        "message" : "Hello world"
    });
})