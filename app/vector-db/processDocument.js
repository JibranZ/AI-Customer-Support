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

// Function to process a PDF file
async function processPdf(filePath) {
	console.log();
	console.log(`Parsing: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    // Split text into chunks
    const chunkSize = 1000;
    let chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
		const rawChunk =  text.slice(i, i + chunkSize); 
		const chunk = preprocessText(rawChunk)
		console.log ("Chunk %d : %s", i, chunk); 
        chunks.push(chunk);
    }
    return chunks;
}

// Function to create embeddings
async function createEmbeddings(texts) {
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
	


// manually uploading  
(async () => {
    const filePath = './foodtrends_capitalgroup.pdf'; // Replace with your actual file path
    const processedTexts = await processPdf(filePath);
    const embeddings = await createEmbeddings(processedTexts);
	addDocsToPinecone(embeddings,"healthresearch","test1");
	console.log("These are the embeddings");
    console.log(embeddings);
})();

module.exports = { processPdf, createEmbeddings }  
