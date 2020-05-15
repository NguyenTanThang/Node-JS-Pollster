var express = require('express');
var router = express.Router();
const {
    getAllPoll,
    getPollByID,
    getPollsByUserID,
    getOptionsByID,
    addPoll,
    editPoll,
    deletePoll,
    addVoterToPoll,
    editVoterInPoll
} = require("../controller/pollControllers");

router.get("/", getAllPoll)

router.get("/:id", getPollByID)

router.get("/get-polls-via-user-id/:user_id", getPollsByUserID)

router.get("/options/:id", getOptionsByID)

router.post("/add", addPoll)

router.put("/edit/:id", editPoll)

router.delete("/delete/:id", deletePoll)

router.post("/add-voter/:id", addVoterToPoll)

router.put("/edit-voter/:id", editVoterInPoll)

module.exports = router;
