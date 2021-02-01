//ADD  REGION & uploadBucket vars to your env.
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const s3 = new AWS.S3();

const uploadBucket = process.env.uploadBucket; // << LOOK!

exports.handler = async (event) => {
  const result = await getUploadURL();
  console.log("Result: ", result);
  return result;
};

const getUploadURL = async function () {
  console.log("getUploadURL started");
  let actionId = Date.now();

  var s3Params = {
    Bucket: uploadBucket,
    Key: `${actionId}.jpg`,
    ContentType: "image/jpeg",
    //    CacheControl: 'max-age=31104000',
    //    ACL: 'public-read',   // Optional if you want the object to be publicly readable
  };

  return new Promise((resolve, reject) => {
    // Get signed URL
    let uploadURL = s3.getSignedUrl("putObject", s3Params);
    resolve({
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        uploadURL: uploadURL,
        photoFilename: `${actionId}.jpg`,
      }),
    });
  });
};
