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

// preprocess text
function preprocessText(text) {
    return text.replace(/\s+/g, ' ');
}

/**
	* creates local json file with chunks and chunkIDS 
	* @param {string} filepath - The path of the file
	* @param {int} chunkSize - Number of characters in each chunk
	* @param {string} prefix - The prefix of each chunkID
	* @param {string} outputPath - where the json file is stored
*/
async function processPdf(filePath, chunkSize, prefix, outputPath) {
	console.log();
	console.log(`Parsing: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;
	

	// chunks saved as ID with text inside it 
	let chunkJSON = [];
    for (let i = 0; i < text.length; i += chunkSize) {
		const id = String(prefix + i);
		const rawChunk =  text.slice(i, i + chunkSize); 
		const chunk = preprocessText(rawChunk)
		chunkJSON.push({
			"id": id, 
			"body": chunk
		});
		// console.log ("Chunk %d : %s", i, chunk); 
    }

	// console.log(chunkJSON);

	// saves chunks as JSON file
	JSONToFile(chunkJSON, outputPath);
	// console.log("\n\nchunkJSON: \n", chunkJSON);

    return chunkJSON;
}


async function createEmbeddings(outputPath) {
 
	//
	const ps = require('fs').promises; 

	try {
		// Read the file asynchronously
		const data = await ps.readFile(outputPath, 'utf8');

		// Parse the JSON data
		const fileContents = JSON.parse(data);

		// Define chunkMap and populate it
		const chunkMap = fileContents.map(item => ({
			id: item.id,
			body: item.body
		}));

		// will contain: docID, docVector
		const embeddingsList = [];


		// populate embeddingsList with docID-docVector pairs
		for (const chunk of chunkMap) { 
			console.log(chunk);


			const res = await openai.embeddings.create({
				model: MODEL,
				input: chunk.body,
				encoding_format: "float",
			});

			embeddingsList.push({
				docID: chunk.id,
				data: res.data[0].embedding
			});
		}

		console.log(embeddingsList);

		return embeddingsList;
	} 

	catch (err) {
		console.error('Error reading or parsing the file:', err);
		throw err; // Rethrow the error to handle it further up the call stack
	}

}




async function addDocsToPinecone (embeddingsList,indexName) {
	const index = await createIndex(indexName); 

	// an array that will be populated with the chunk embeddings 
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
	
const JSONToFile = (obj, filename) => 
	fs.writeFileSync(`docDB/${filename}.json`, JSON.stringify(obj,null,2));


// manually uploading  
(async () => {
    const filePath = './foodtrends_capitalgroup.pdf'; // Replace with your actual file path

	// processes documents and creates chunk in docDB/indexedChunks.json
    const processedTexts = await processPdf(filePath,350,"chunksA","indexedChunks");

	// create embeddings that are mapped to respective chunk IDs
	const embeddings = await createEmbeddings("docDB/indexedChunks.json");	
		
	// embeddings are uploaded to index in database
	addDocsToPinecone(embeddings,"healthresearch2");

})();

module.exports = { processPdf, createEmbeddings }  
