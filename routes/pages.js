const express = require("express")
const router = express.Router(); 
/* GET home page. */
router.get("/", (req, res) => {
    const date = new Date(); 
    res.redirect("/map");
})
router.get("/map", (req, res) => { res.render("index") })
 

module.exports = router;