const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const MODEL = 'text-embedding-3-small'; 
const { generateEmbedding, addDocumentsToIndex } = require("./embedDocs");
const { createIndex } = require("./pineconeClient");
require('dotenv').config();


// Initialize OpenAI client with API key
const openai = new OpenAI({
  // apiKey:"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",
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
		console.log("Embedding");
		console.log(res);
        embeddingsList.push(res.data[0].embedding);
    }
    return embeddingsList;
}


async function addDocsToPinecone (embeddingsList,indexName) {
	const index = await createIndex(indexName); 

	for (const doc of embeddingsList) {
		await index.upsert({
			id: doc.id,
			values: doc
		});
	}
}
	


// manually uploading  
(async () => {
    const filePath = './foodtrends_capitalgroup.pdf'; // Replace with your actual file path
    const processedTexts = await processPdf(filePath);
    const embeddings = await createEmbeddings(processedTexts);
	addDocsToPinecone(embeddings,"Nutrition");
	console.log("These are the embeddings");
    console.log(embeddings);
})();

module.exports = { processPdf, createEmbeddings }  
