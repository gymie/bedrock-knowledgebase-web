require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } = require("@aws-sdk/client-bedrock-agent-runtime"); 

const app = express();

app.use(bodyParser.json());
app.use(cors());

const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION
});


app.post('/chatbot', async (req, res) => {
    const { prompt } = req.body;

    const command = new RetrieveAndGenerateCommand({
        input: { 
            text: prompt
        },
        retrieveAndGenerateConfiguration: {
            type: "KNOWLEDGE_BASE", 
            knowledgeBaseConfiguration: {
                knowledgeBaseId: process.env.AWS_KNOWLEDGE_BASE_ID, 
                modelArn: `arn:aws:bedrock:${process.env.AWS_REGION}::foundation-model/anthropic.claude-v2:1`, 
            },
        },
    });

    const response = await client.send(command);
    res.send({
        response: response.output.text
    });
}
);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
}
);