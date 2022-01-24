import axios from "axios";

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);

          axios
            .post(`${process.env.REACT_APP_SERVER_URL}/fileUploader`, formData)
            .then((res) => {
              console.log("resss", res.data.files[0].uri);
              resolve({
                default: res.data.files[0].uri,
              });
            });
        })
    );
  }
}

export default MyUploadAdapter;
