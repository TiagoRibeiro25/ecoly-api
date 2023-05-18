const db = require("../models/db");
const colors = require("colors");
const jwt = require("jsonwebtoken");
const { Op, ValidationError } = require("sequelize");
const meetings = db.meetings;
const meeting_ata_image = db.meeting_ata_image;
const badges = db.badges;
const userBadges = db.user_badge;
const unlockBadge = require("../utils/unlockBadge");
const addSeeds = require("../utils/addSeeds");


exports.getAtaMeeting = async (req, res) => {
    console.log(colors.green("Ata Meeting"));
};

exports.createMeeting = async (req, res) => {
    console.log(colors.green("Create Meeting"));
};

exports.addAta = async (req, res) => {
    console.log(colors.green("Add Ata to meeting"));
};


exports.deleteMeeting = async (req, res) => {
    console.log(colors.green("Delete Meeting"));
};