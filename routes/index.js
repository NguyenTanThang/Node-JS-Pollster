var express = require('express');
var router = express.Router();
const Poll = require("../models/Poll");
const User = require("../models/User");
const pagination = require("../utils/pagination");
const authChecker = require("../config/auth-check");

router.get("/", async (req, res) => {
    let {
        page,
        search
    } = req.query;

    if (!req.user) {
        return res.redirect("/login");
    }

    try {
        const checkVoter = (voters, user_id) => {
            let tof = false;

            for (let index = 0; index < voters.length; index++) {
                const voter = voters[index];
                console.log(voter);
                console.log(user_id);
                if (voter.voter_id == user_id) {
                    tof = true
                    break;
                }
                if (voters.length - 1 === index && tof === false) {
                    tof = false
                }
            }

            return tof;
        }

        let polls = await Poll.find()
        let authors = [];
        let disables = [];

        if (search) {
            polls = polls.filter(pollItem => {
                return pollItem.question.includes(search);
            })
        }

        const pages = pagination(polls.length, page, 5, 5);
        console.log(pages);

        if (polls.length == 0){
            return res.render("home", {
                polls,
                authors,
                disables,
                pages
            });
        }

        polls.forEach(async poll => {
            const user_id = poll.user_id;
            const author = await User.findById(user_id);
            authors.push(author)

            //console.log(author)
            //console.log(authors)
            if (authors.length == polls.length) {
                polls.forEach(poll => {
                    for (let index = 0; index < poll.options.length; index++) {
                        const option = poll.options[index];
                        if (checkVoter(option.voters, req.user._id)) {
                            disables.push("disabled");
                            break;
                        }
                        if (index === poll.options.length - 1) {
                            disables.push("");
                            break;
                        }
                    }
                })

                console.log(disables)

                if (search) {
                    polls = polls.filter(poll => {
                        return poll.question.toLowerCase().includes(search.toLowerCase())
                    })
                }

                polls = polls.slice(pages.startIndex, pages.endIndex + 1)

                console.log(polls)

                return res.render("home", {
                    polls,
                    authors,
                    disables,
                    pages
                });
            }
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

router.get("/profile", async (req, res) => {
    try {
        const polls = await Poll
            .find({
                user_id: req.user._id
            })

        return res.render("profile", {
            polls
        });
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

router.get("/add-poll", async (req, res) => {
    try {
        const numberOfPolls = await Poll.find({
            user_id: req.user._id
        })

        if (numberOfPolls.length >= 5) {
            return res.redirect("/profile")
        } else {
            return res.render("add-poll");
        }

    } catch (error) {

    }
})

router.get("/login", (req, res) => {
    if (req.user){
        return res.redirect("/profile");
    }
    res.render("login");
})

router.get("/signup", (req, res) => {
    if (req.user){
        return res.redirect("/profile");
    }
    res.render("signup");
})

module.exports = router;