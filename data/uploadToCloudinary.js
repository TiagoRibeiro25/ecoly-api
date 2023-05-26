const cloudinary = require("../config/cloudinary.config");
const base64 = require("./base64");

async function uploadToCloudinary(image, folder) {
	try {
		await cloudinary.uploader.upload(image, {
			folder: folder, crop: "scale"
		});
	} catch (err) {
		console.log(err);
	}
}


async function uploadImages() {
	await Promise.all([
		uploadToCloudinary(base64.newImg1, "news"),
		uploadToCloudinary(base64.newImg2, "news"),
		uploadToCloudinary(base64.newImg3, "news"),
		uploadToCloudinary(base64.newImg4, "news"),
		uploadToCloudinary(base64.newImg5, "news"),
		uploadToCloudinary(base64.newImg6, "news"),
		uploadToCloudinary(base64.newImg7, "news"),
		uploadToCloudinary(base64.newImg8, "news"),
		uploadToCloudinary(base64.newImg9, "news"),
		uploadToCloudinary(base64.newImg10, "news"),
		uploadToCloudinary(base64.newImg11, "news"),
		uploadToCloudinary(base64.newImg12, "news"),
		uploadToCloudinary(base64.newImg13, "news"),
		uploadToCloudinary(base64.newImg14, "news"),
		uploadToCloudinary(base64.newImg15, "news"),
		uploadToCloudinary(base64.newImg16, "news"),
		uploadToCloudinary(base64.ataImg1, "meetings"),
		uploadToCloudinary(base64.ataImg2, "meetings"),
		uploadToCloudinary(base64.activityImg1, "activities"),
		uploadToCloudinary(base64.activityImg2, "activities"),
		uploadToCloudinary(base64.activityImg3, "activities"),
		uploadToCloudinary(base64.activityImg4, "activities"),
		uploadToCloudinary(base64.activityImg5, "activities"),
		uploadToCloudinary(base64.activityImg6, "activities"),
		uploadToCloudinary(base64.activityImg7, "activities"),
		uploadToCloudinary(base64.activityImg8, "activities"),
		uploadToCloudinary(base64.activityReportImg1, "reports"),
		uploadToCloudinary(base64.activityReportImg2, "reports"),
		uploadToCloudinary(base64.activityReportImg3, "reports"),
		uploadToCloudinary(base64.activityReportImg4, "reports")
	]);

}

module.exports = uploadImages;

