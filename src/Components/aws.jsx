import axios from "axios";

export const uploadImage = async (img) => {
    let imgUrl = null;

    await axios
        .get("https://aquadb-server.onrender.com/get-upload-url")
        .then(async ({ data: { uploadUrl } }) => {
            await axios({
                method: "PUT",
                url: uploadUrl,
                headers: { "Content-Type ": "multipart/form-data" },
                data: img,
            }).then(() => {
                imgUrl = uploadUrl.split("?")[0];
            });
        });

    return imgUrl;
};
