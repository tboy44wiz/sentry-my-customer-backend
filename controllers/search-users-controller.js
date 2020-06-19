const Response = require('../util/response_manager');
const HttpStatus = require('../util/http_status');
const express = require('express');
const db = require("../models");
const Search = db.user;



exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: {$regex: new RegExp(title), options: "i"}} : {};

    Search.find(condition)
        .then(data => {
            res.send(data);
            })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving tutorials."
            });
        });

}
