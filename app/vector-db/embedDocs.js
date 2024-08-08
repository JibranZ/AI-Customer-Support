const { createIndex } = require("./pineconeClient");
const OpenAI = require('openai');
require('dotenv').config();
const MODEL = 'text-embedding-3-small'; 


// initialize OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});


// returns embedding given text 
async function generateEmbedding (text) {
	const response = await openai.embedding.create({
		input: text, 
		model: MODEL,
		encoding_format: "float",
	});
	return response.data[0].embedding;
}


// adds documents 
async function addDocumentsToIndex (documents, indexName) {
	const index = await createIndex(indexName); 
	
	for (const doc of documents) {
		const embedding = await generateEmbedding(doc.content);
		await index.upsert({
			id: doc.id,
			values: embedding, 
		});
	}
}

// query pinecone index to retrieve relevant documents
async function queryIndex(query, indexName) { 
	const index = await createIndex(indexName);
	const embedding = await generateEmbedding(query);
	const queryResponse = await index.query({
		topK: 10, //number of results to retrieve
		vector: embedding, 
	});
	return queryResponse.matches;
}


module.exports = { addDocumentsToIndex, queryIndex }; 











