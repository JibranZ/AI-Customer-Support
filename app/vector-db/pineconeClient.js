const { Pinecone } = require("@pinecone-database/pinecone");
require('dotenv').config();

const pclient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

// // requires .env file in current directory
// require('dotenv').config();

// const pclient = new PineconeClient();

// // initializes connection using API key
// async function initPinecone() {
// 	await pclient.init({
// 		apiKey: process.env.PINECONE_API_KEY,
// 	});
// }

// creates an index given a name
async function createIndex(indexName) {

	const existingIndexes = await pclient.listIndexes();

	// if index doesn't alread exit create it 
	if (! existingIndexes.includes(indexName)) { 
		await pclient.createIndex({
			name: indexName,
			dimension: 768, 
			metric: "cosine",
		});
	}
	return pclient.Index(indexName); 
}


module.exports = { pclient, createIndex };
