const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const OpenAI = require('openai');
const { marked } = require('marked');

// IMPORTANT: Replace with your Clarifai PAT. It's recommended to use an environment variable for this.
const CLARIFAI_PAT = process.env.CLARIFAI_PAT || "REPLACE_WITH_YOUR_CLARIFAI_PAT";
const systemPrompt = `
You are a support manager for Clarifai, an AI company that provides computer vision and AI solutions. 
DO NOT go beyond the scope of Clarifai's products, services and documentation.
DO NOT do any coding, programming, general knowledge tasks. Politely refuse such requests.

Your task is to assist users with their questions about Clarifai's products, services, and general AI concepts. 
Provide clear, concise, and accurate information to help users understand and utilize Clarifai's offerings effectively.

---

Here is a dump from pricing page:

Pricing
Compare Plans
Inference Pricing
Dedicated Node Pricing
FAQs
1xLogo plan community-1
Community
Explore AI using serverless pre-trained models in the cloud, our robust API and low-code UIs.

Up to 1K API Calls/month
Pre-trained models
1 Request per Second
1 Org for your team
1 Local Runner with 2 hours of runtime
Community support
$0/mo
Get Community
developer
Developer
Connect your AI models, MCP servers and agents to Clarifai's cloud API using your own hardware.

Everything from Community, and:

Connect up to 5 Local Runners
Unlimited runner hours
Email support & updates
Starts at $1/mo (Promotion)
Get Developer
essential
Essential
Core AI development capabilities across our cloud or your self-hosted compute. 

Up to 30K API Calls/month
Connect up to 5 AI Runners
Upload any model
Fine-tune specialist models
Dedicated GPU clusters with up to 2 nodes
NVIDIA A10 and L4 GPUs
30 Requests per Second
Email support
Starts at $30/mo
Get Essential
Professional
Professional
Development and production AI workloads, more advanced dedicated GPUs and Control Center.

Everything from Essential, and:
Up to 100K API Calls/month
Train & fine-tune models
Dedicated GPU clusters with up to 6 nodes
NVIDIA A10, L4, L40S, and A100 GPUs
100 Requests per Second
Starts at $300/mo
Get Professional
Enterprise
Hybrid-Cloud AI Enterprise
Unlimited SaaS or VPC AI development and production workloads.

Unlimited API calls
Clarifai’s SaaS or private control plane
Multi-cloud and multi-region compute planes with any GPU
Optional air-gapped deployments and private data planes
Full model exports, leaderboards
Custom rate limits
Role-based access, Teams, multiple Orgs
Enterprise 99.99% SLAs
24/7 dedicated support
Custom Pricing
Talk to our AI experts

`;


const client = new OpenAI({
  baseURL: "https://api.clarifai.com/v2/ext/openai/v1",
  apiKey: CLARIFAI_PAT,
});

fastify.register(cors, {
  origin: "*", // Allow all origins for development
});

fastify.post('/chat', async (request, reply) => {
  const { message } = request.body;

  if (!message) {
    return reply.status(400).send({ error: 'Message is required' });
  }

  try {
    const response = await client.chat.completions.create({
      model: "https://clarifai.com/openai/chat-completion/models/gpt-oss-120b",
      messages: [
        { "role": "system", "content": systemPrompt },
        { "role": "user", "content": message },
      ],
    });

    console.log("Clarifai API response:", JSON.stringify(response, null, 2));
    const botMessage = response.choices[0].message.content;

    console.log("Bot message:", botMessage);
    const htmlMessage = marked(botMessage);
    reply.send({ reply: htmlMessage });

  } catch (error) {
    console.log("Error from Clarifai API:", error);
    fastify.log.error(error);
    reply.status(500).send({ error: 'Failed to get response from Clarifai API' });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
