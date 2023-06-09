const formats = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg", "svg+xml", "tiff"];

function validateImgs(imgs) {
	return !imgs.every((image) => {
		
			return typeof image == "string" && formats.some((format) => image.startsWith(`data:image/${format};base64`)) && image.length > 22;
		}
	);
}

module.exports = validateImgs;
