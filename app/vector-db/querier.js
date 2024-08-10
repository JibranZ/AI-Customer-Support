const { createIndex } = require("./pineconeClient");
const OpenAI = require('openai');
require('dotenv').config();
const MODEL = 'text-embedding-ada-002'; 

// initialize OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});



// testing: returns embedding given text  
async function generateEmbedding (text) {
	const response = await openai.embeddings.create({
		input: text, 
		model: MODEL,
		encoding_format: "float",
	});
	return response.data[0].embedding;
}



// testing: adds documents 
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



/**
	* after getting results from pinecone query, the body of the resulting vector is 
	* located and returned
	* @param {outputPath} - the path to the json file containing the chunks -- (chunkID, body) 
	* @param {chunkID} - the chunkID to locate within the file 
*/
async function retrieveChunkBody (outputPath, chunkID) {
	
	const ps = require('fs').promises; 

	// Read the file asynchronously
	const data = await ps.readFile(outputPath, 'utf8');

	// Parse the JSON data
	const fileContents = JSON.parse(data);

	const result = fileContents.find(item => item.id === chunkID);
	return result.body;

}




// getting relevant information given a prompt 
//

/** Retrieving relevant documentation given a prompt 
	*
	*
*/ 
async function getPrompt (prompt,path) {
	// get vectors with most matches
	const matches     = await queryIndex(prompt, "healthresearch2");

	var topmatches = [] 

	// get top 3 matches which also contain the IDs
	for (let i = 0; i < 3; i++) {
		topmatches.push (matches[i].id); 
	}
	console.log(topmatches);

	let context;

	//retrieve bodies of the chunks and add them to the context 
	for (const match of topmatches) { 

        // this is the path: docDB/indexedChunks.json
		const body = await retrieveChunkBody(path, match)
		console.log(body);
		context += " ";
		context += body;
	} 
	// console.log("Context: ", context);
	// console.log(process.cwd());
	return context;

}


module.exports = { addDocumentsToIndex, queryIndex, getPrompt, retrieveChunkBody  }; 


// (async () => {
	// console.log("querier.js");
	// const test2 = 'when was the sale of lab-grown chicken approved?';
	// const test3 = 'has it been approved by the US Department of Agriculture?';

	// // embedding2 = await generateEmbedding(test2);
	// // embedding3 = await generateEmbedding(test3);
	
	// // console.log(embedding1);


	// console.log('\n\n querying embedded data \n\n');
	// // const query1 = await queryIndex(test1,"healthresearch2")

	// console.log('\n\n querying embedded data \n\n');
	// const query2 = await queryIndex(test2,"healthresearch2")

	// console.log('\n\n querying embedded data \n\n');
	// const query3 = await queryIndex(test3,"healthresearch2")
	
	// // for (const part of query1) {
	// // 	// console.log(part);
	// // }
	
	// // retrieveChunkBody( "docDB/indexedChunks.json", "chunksA750")
	
	// getPrompt(test2);


	// console.log("\n\ntest3\n");
	// getPrompt(test3);

// })();











