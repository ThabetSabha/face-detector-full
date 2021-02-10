//ADD REGION & deleteBucket vars to your env.
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const s3 = new AWS.S3();

const deleteBucket = process.env.deleteBucket; // << LOOK!

exports.handler = async (event) => {
  let body = JSON.parse(event.body)
  const {deleteKey} = body;
  const result = await deleteObject(deleteKey)
  return result
};

const deleteObject = async function (deleteKey) {
  var s3Params = {
    Bucket: deleteBucket,
    Key: deleteKey,
    //    ACL: 'public-read',   // Optional if you want the object to be publicly readable
  };

  return new Promise((resolve, reject) => {
    // deleteObject
    s3.deleteObject(s3Params, (err, cas) => {
      if (err) {
        resolve({
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            response: err,
          }),
        });
      } else {
        resolve({
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            response: "Success",
          }),
        });
      }
    });
  });
};
