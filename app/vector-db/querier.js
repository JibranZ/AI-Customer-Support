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
// retVal is vector of the top 10 matches
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


async function retrieveChunkBody (outputPath, chunkID) {
	
	const ps = require('fs').promises; 

	// Read the file asynchronously
	const data = await ps.readFile(outputPath, 'utf8');

	// Parse the JSON data
	const fileContents = JSON.parse(data);

	const result = fileContents.find(item => item.id === chunkID);
	// console.log(result);
	return result.body;
}


async function getPrompt (prompt) {
	// get vectors with most matches
	const matches     = await queryIndex(prompt, "healthresearch2");

	var top3matches = [] 

	// get top 3 matches which also contain the IDs
	for (let i = 0; i < 3; i++) {
		top3matches.push (matches[i].id); 
	}
	console.log(top3matches);

	let context;

	// retrieve bodies of the chunks and add them to the context 
	for (const match of top3matches) {
		const body = await retrieveChunkBody("docDB/indexedChunks.json", match)
		console.log(body);
		context=+ " "; 
		context =+ body;
	} 
	

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
	
	// console.log(embedding1);


	console.log('\n\n querying embedded data \n\n');
	const query1 = await queryIndex(test1,"healthresearch2")

	console.log('\n\n querying embedded data \n\n');
	const query2 = await queryIndex(test2,"healthresearch2")

	console.log('\n\n querying embedded data \n\n');
	const query3 = await queryIndex(test3,"healthresearch2")
	
	for (const part of query1) {
		// console.log(part);
	}
	// for (const part of query2) {
	// 	console.log(part);
	// }
	// for (const part of query3) {
	// 	console.log(part);
	// }
	//
	// console.log(query1[0]);
	
	// retrieveChunkBody( "docDB/indexedChunks.json", "chunksA750")
	
	getPrompt(test1);
	

})();











