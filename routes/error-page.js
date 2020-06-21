const router = require("express").Router(),
            ejs = require("ejs");

router.get("*", (req, res)=>{
    res.render("error-page.ejs")
})

module.exports = router;