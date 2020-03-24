const Poll = require('../models/Poll');
const pagination = require("../utils/pagination");

const getAllPoll = async (req, res, next) => {
    const {page} = req.query;

    try {
        let polls = await Poll.find()
        const pages = pagination(polls.length, page, 3, 5);

        if (page){
            polls= polls.slice(pages.startIndex, pages.endIndex+1)
        }

        return res.status(200).json({
            success: true,
            data: polls
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const getPollByID = async (req, res, next) => {
    try {
        const {
            id
        } = req.params
        const poll = await Poll.findById(id)

        return res.status(200).json({
            success: true,
            data: poll
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const getPollsByUserID = async (req, res, next) => {
    try {
        const {
            user_id
        } = req.params
        const polls = await Poll.find({
            user_id
        })

        return res.status(200).json({
            success: true,
            data: polls
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const getOptionsByID = async (req, res, next) => {
    try {
        const {
            id
        } = req.params
        const polls = await Poll.findById(id)
        const options = polls.options

        return res.status(200).json({
            success: true,
            data: options
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const addPoll = async (req, res, next) => {
    try {
        const {
            question,
            options,
            user_id
        } = req.body;
        let totalVoters = 0;

        const createdPoll = await new Poll({
            question,
            options,
            user_id,
            totalVoters
        }).save()

        return res.status(200).json({
            success: true,
            data: createdPoll
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        }

        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const editPoll = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        let updatedPoll = await Poll.findByIdAndUpdate(id, req.body);
        updatedPoll = await Poll.findById(id)

        return res.status(200).json({
            success: true,
            data: updatedPoll
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
} 

const deletePoll = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        let deletedPoll = await Poll.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            data: deletedPoll
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
} 

const addVoterToPoll = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;
        const {
            voter_id, optionIndex
        } = req.body

        let designatedPoll = await Poll.findById(id);

        console.log(optionIndex)
        console.log(voter_id)
        console.log(designatedPoll.options[optionIndex].voters)
        
        designatedPoll.options[optionIndex].voters.push({voter_id});
        designatedPoll.options[optionIndex].votersCount += 1;
        designatedPoll.totalVoters += 1;

        let updatedPoll = await Poll.findByIdAndUpdate(id, designatedPoll);
        updatedPoll = await Poll.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedPoll
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const editVoterInPoll = async (req, res, next) => {
    const current_user_id = req.user._id
    
    const checkVoter = (voters) => {
        let tof = false;

        for (let index = 0; index < voters.length; index++) {
            const voter = voters[index];
            console.log(voter);
            console.log(current_user_id);
            if (voter.voter_id == current_user_id){
                tof = true
                break;
            }
            if (voters.length - 1 === index && tof === false){
                tof = false
            }
        }

        return tof;
    }

    try {
        const {
            id
        } = req.params;
        const {
            voter_id, optionIndex
        } = req.body

        let designatedPoll = await Poll.findById(id);
        let oldOptionIndex = -1;

        for (let index = 0; index < designatedPoll.options.length; index++) {
            const option = designatedPoll.options[index];
            
            if(checkVoter(option.voters)){
                oldOptionIndex = index;
                break;
            }

        }        
        
        // Remove old option
        designatedPoll.options[oldOptionIndex].voters = designatedPoll.options[oldOptionIndex].voters.filter(voter => {
            return voter.voter_id !== voter_id
        })
        designatedPoll.options[oldOptionIndex].votersCount -= 1;

        // Add new option
        designatedPoll.options[optionIndex].voters.push({voter_id});
        designatedPoll.options[optionIndex].votersCount += 1;

        let updatedPoll = await Poll.findByIdAndUpdate(id, designatedPoll);
        updatedPoll = await Poll.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedPoll
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

module.exports = {
    getAllPoll,
    getPollByID,
    getPollsByUserID,
    getOptionsByID,
    addPoll,
    editPoll,
    deletePoll,
    addVoterToPoll,
    editVoterInPoll
}