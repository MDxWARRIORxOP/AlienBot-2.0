require("dotenv").config()
const firebase = require("firebase-admin/app");
const firestore = require("firebase-admin/firestore");
const FirebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)

const app = firebase.initializeApp({
  credential: firebase.cert(FirebaseConfig)
});

const db = firestore.getFirestore();

const addTestData = async () => {
  // data from docs
  const docRef = db.collection("users").doc("alovelace");

  await docRef.set({
    first: "Ada",
    last: "Lovelace",
    born: 1815,
  });

  const aTuringRef = db.collection("users").doc("aturing");

  await aTuringRef.set({
    first: "Alan",
    middle: "Mathison",
    last: "Turing",
    born: 1912,
  });
};

/**
 *  @param collectionName String, name of the collection to add data to.
 *  @param docName String, name of the document to add data to.
 *  @param dataObj JS object, the data to add to the document.
 *  @example addData("users", "test", {hello: "world"})
 *  @returns data Reference
 **/
const addData = async (collectionName, docName, dataObj) => {
  const dataRef = db.collection(collectionName).doc(docName);

  const dataSet = await dataRef.set(dataObj);
  console.log(dataSet);
  return dataSet;
};

/**
 *  @param collectionName String, name of the collection to get a doc from.
 *  @param docName String, name of the doc ot get data from.
 *  @example getData("users", "Kingerious")
 *  @returns if no data is found, returns null, if data is found, returns the document data as a JS Object
 **/
const getData = async (collectionName, docName) => {
  const dataRef = db.collection(collectionName).doc(docName);
  const doc = await dataRef.get();
  if (!doc.exists) {
    return null;
  } else {
    return doc.data();
  }
};

module.exports = {
  addData,
  getData,
};
