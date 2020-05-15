var express = require('express');
var router = express.Router();
const Poll = require("../models/Poll");
const User = require("../models/User");

router.get("/:id", async (req, res) => {
    const {
        id
    } = req.params;

    try {
        let selectedOption = "N/A";
        const checkVoter = (option) => {
            let tof = false;
            const voters = option.voters;
    
            for (let index = 0; index < voters.length; index++) {
                const voter = voters[index];
                console.log(voter);
                console.log(req.user._id);
                if (voter.voter_id == req.user._id) {
                    tof = true;
                    selectedOption = option.opinion;
                    break;
                }
                if (voters.length - 1 === index && tof === false) {
                    tof = false
                }
            }
    
            return tof;
        }
            
        const poll = await Poll.findById(id)
        const author = await User.findById(poll.user_id)
        let disabled = "disabled";

        for (let index = 0; index < poll.options.length; index++) {
            const option = poll.options[index];
            if (checkVoter(option)) {
                disabled = "disabled";
                break;
            }
            if (index === poll.options.length - 1) {
                disabled = "";
                break;
            }
        }

        console.log({
            poll,
            author,
            disabled,
            selectedOption
        })

        return res.render("single-poll", {
            poll,
            author,
            disabled,
            selectedOption
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: [
                'Internal Server Error'
            ]
        });
    }
})

module.exports = router;