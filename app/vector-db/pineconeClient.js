const { Pinecone } = require("@pinecone-database/pinecone");
require('dotenv').config();

const pclient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});


// creates an index given a name
async function createIndex(indexName) {

	const existingIndexes = await pclient.listIndexes();
	const doesExist = existingIndexes.indexes.some(index => index.name === indexName);

	// if index doesn't alread exit create it 
	if (! doesExist) { 
		await pclient.createIndex({
			name: indexName,
			dimension: 1536, 
			metric: "cosine",
			spec: {
				serverless: { 
					cloud: 'aws', 
					region: 'us-east-1'
				}
			}
		});
	}
	return pclient.Index(indexName); 
}


module.exports = { pclient, createIndex };
