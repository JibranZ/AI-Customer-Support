const { createIndex } = require("./pineconeClient");
const OpenAI = require('openai');
require('dotenv').config();
const MODEL = 'text-embedding-ada-002'; 

// initialize OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});



// returns embedding given text 
async function generateEmbedding (text) {
	const response = await openai.embeddings.create({
		input: text, 
		model: MODEL,
		encoding_format: "float",
	});
	return response.data[0].embedding;
}



// adds documents 
async function addDocumentsToIndex (documents, indexName) {
	const index = await createIndex(indexName); 
	
	const upsertArray = [] ;

	for (const doc of documents) {
		const embedding = await generateEmbedding(doc.content);
		upsertArray.push({
			id: doc.id,
			values: embedding, 
		});

		await index.upsert(upsertArray);

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
	console.log(`Query Response: ${queryResponse}`);
	return queryResponse.matches;
}


module.exports = { addDocumentsToIndex, queryIndex }; 


(async () => {
	console.log("querier.js");
	const test1 = 'What are the economic conditions in Iceland?';
	const test2 = 'when was the sale of lab-grown chicken approved?';
	const test3 = 'has it been approved by the US Department of Agriculture?';

	embedding1 = await generateEmbedding(test1);
	embedding2 = await generateEmbedding(test2);
	embedding3 = await generateEmbedding(test3);


	console.log('\n\n querying embedded data \n\n');
	const query1 = await queryIndex(test1,"healthresearch")

	console.log('\n\n querying embedded data \n\n');
	const query2 = await queryIndex(test2,"healthresearch")

	console.log('\n\n querying embedded data \n\n');
	const query3 = await queryIndex(test3,"healthresearch")
	
	for (const part of query1) {
		console.log(part);
	}
	for (const part of query2) {
		console.log(part);
	}
	for (const part of query3) {
		console.log(part);
	}

})();











