const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const MODEL = 'text-embedding-ada-002'; 
const { createIndex } = require("./pineconeClient");
require('dotenv').config();


// Initialize OpenAI client with API key
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});


// clean the text
function preprocessText(text) {
    return text.replace(/\s+/g, ' ');
}

/**
	* creates local json file with chunks and chunkIDS 
	* @param {string} filepath - The path of the document file what will be chunkified
	* @param {int} chunkSize - Number of characters in each chunk
	* @param {string} prefix - The prefix of each chunkID -- useful for organization
	* @param {string} outputPath - json file with JSON list -- {chunkID, chunkBody} 
*/
async function processPdf(filePath, chunkSize, prefix, outputPath) {
	console.log();
	console.log(`Parsing: ${filePath}`);

	// reading the documentation and parsing it into a variable
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;
	

	// creating document chunks with corresponding IDs based off the prefix
	let chunkJSON = [];
    for (let i = 0; i < text.length; i += chunkSize) {
		const id = String(prefix + i);
		const rawChunk =  text.slice(i, i + chunkSize); 
		const chunk = preprocessText(rawChunk)
		chunkJSON.push({
			"id": id, 
			"body": chunk
		});
    }

	// writing the document chunks to a JSON file  
	JSONToFile(chunkJSON, outputPath);

    return chunkJSON;
}


// creating embeddings based on a json fiel 
async function createEmbeddings(jsonFile) {
 
	// asynchronous file reading 
	const ps = require('fs').promises; 
	try {
		// Read the file asynchronously
		const data = await ps.readFile(jsonFile, 'utf8');

		// Parse the JSON data
		const fileContents = JSON.parse(data);

		// loading JSON file into iterable object 
		const chunkMap = fileContents.map(item => ({
			id: item.id,
			body: item.body
		}));

		// will contain: docID, docVector. docID corresponds to chunkID in processPDF 
		const embeddingsList = [];

		// populate embeddingsList with docID-docVector pairs
		for (const chunk of chunkMap) { 
			console.log(chunk);

			// create embeddings using OpenAI 
			const res = await openai.embeddings.create({
				model: MODEL,
				input: chunk.body,
				encoding_format: "float",
			});
			
			// store embeddings in a list
			embeddingsList.push({
				docID: chunk.id,
				data: res.data[0].embedding
			});
		}

		return embeddingsList;
	} 

	catch (err) {
		console.error('Error reading or parsing the file:', err);
		throw err; // Rethrow the error to handle it further up the call stack
	}

}


// writes all the embeddings to the index
async function addDocsToPinecone (embeddingsList,indexName) {
	// creates index if it is not there 
	const index = await createIndex(indexName); 

	// for storing the chunk embeddings 
	const docsToUpsert = [];

	console.log('\n\naddDocToPineCone -- for-loop on embeddingsList\n')
	console.log(embeddingsList[0]);
	
	// iterate through the embeddings, mapping the chunkIDs to corresponding vectors
	for (let i = 0; i < embeddingsList.length; i++) {
		docsToUpsert.push({
			id: embeddingsList[i].docID,
			values: embeddingsList[i].data,
		});
	}
	console.log("\n\nDocsToUpsert:\n\n");
	console.log(docsToUpsert);
	await index.upsert(docsToUpsert);
}
	

// writes json to a file
const JSONToFile = (obj, filename) => 
	fs.writeFileSync(`docDB/${filename}.json`, JSON.stringify(obj,null,2));


/*

	// pipeline for processing documents
(async () => {
	// put document file path here. Relative to current directory 
    const filePath = './foodtrends_capitalgroup.pdf'; // Replace with your actual file path

	// processes documents and creates chunks in docDB/indexedChunks.json
    const processedTexts = await processPdf(filePath,300,"chunksA","indexedChunks");

	// create embeddings that are mapped to chunkIDs that were saved in indexedChunks.json 
	const embeddings = await createEmbeddings("docDB/indexedChunks.json");	
		
	// embeddings are uploaded to index 'healthresearch2' in database
	addDocsToPinecone(embeddings,"healthresearch2");

}();
*/

module.exports = { processPdf, createEmbeddings, addDocsToPinecone }  
