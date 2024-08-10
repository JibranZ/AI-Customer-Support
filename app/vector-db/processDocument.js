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
	// Read the file asynchronously
	const fs = require('fs');

	// Define fileContents variable in a broader scope if needed
	let fileContents;

	const embeddingsList = [];

	fs.readFile(outputPath, 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading the file:', err);
			return;
		}

		
		fileContents = JSON.parse(data);


		fileContents.forEach(item => {
			console.log(item.id);
			console.log(item.body);
		});
		// try {
		// 	// Parse the JSON data
		// 	fileContents = JSON.parse(data);

		// 	// Log the type of the parsed data
		// 	console.log('File contents:', fileContents);
		// 	console.log('Type of fileContents:', typeof fileContents);

		// 	// Check and handle different types of JSON data
		// 	if (Array.isArray(fileContents)) {
		// 		console.log('The data is an array.');
		// 		// Example: Iterate through array items
		// 		fileContents.forEach(item => console.log(item));
		// 	} else if (typeof fileContents === 'object' && fileContents !== null) {
		// 		console.log('The data is an object.');
		// 		// Example: Iterate through object keys
		// 		Object.keys(fileContents).forEach(key => console.log(`${key}: ${fileContents[key]}`));
		// 	} else {
		// 		console.log('Unexpected data format:', fileContents);
		// 	}

		// } catch (parseError) {
		// 	console.error('Error parsing JSON:', parseError);
		// }
	})
}



// Function to create embeddings
async function createEmbeddingsOG(texts) {
    const embeddingsList = [];
    for (const text of texts) {
        const res = await openai.embeddings.create({
			model: MODEL,
            input: text,
			encoding_format: "float",
        });
		console.log();
		// console.log("\nEmbedding");
		// console.log(res);
		// embeddingsList.push(res);
		// console.log("\nEmbeddingList");
		// console.log(res.data[0].embedding);
        embeddingsList.push(res.data[0].embedding);
    }

	console.log("\nEmbeddingList");
	console.log(embeddingsList);
    return embeddingsList;
}


async function addDocsToPinecone (embeddingsList,indexName, listName) {
	const index = await createIndex(indexName); 

	// an array that will be populated with the chunk embeddings 
	const docsToUpsert = [];

	console.log('\n\naddDocToPineCone -- for-loop on embeddingsList\n')
	console.log(embeddingsList[0]);
	
	// iterate through the embeddings, creating a unique ID based on the listName
	for (let i = 0; i < embeddingsList.length; i++) {
		docsToUpsert.push({
			id: String(listName + i),
			values: embeddingsList[i],
		});
		// console.log(i);
		// console.log(embeddingsList[i]); 
	}
	console.log("\n\nDocsToUpsert:\n\n");
	console.log(docsToUpsert);
	await index.upsert(docsToUpsert);
}
	
const JSONToFile = (obj, filename) => 
	fs.writeFileSync(`docDB/${filename}.json`, JSON.stringify(obj,null,2));
	// fs.writeFileSync(`docDB/${filename}.json`, JSON.stringify(obj,null,2));


// manually uploading  
(async () => {
    const filePath = './foodtrends_capitalgroup.pdf'; // Replace with your actual file path

	// processes documents and creates file in docDB/indexedChunks.json
    const processedTexts = await processPdf(filePath,750,"chunksA","indexedChunks");

    // const embeddings = await createEmbeddingsOG(processedTexts);

	// create embeddings based on json file
	const embeddings = await createEmbeddings("docDB/indexedChunks.json");	
		
	// addDocsToPinecone(embeddings,"healthresearch","test1");
	// console.log("These are the embeddings");
    // console.log(embeddings);
})();

module.exports = { processPdf, createEmbeddings }  
