import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



export default async function (req : NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  const daf = req.body.daf.text[0] || '';
  console.log(daf);
  if (daf.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return daf.split(0,100);
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateDafSummary(daf),
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const result = completion.data.choices[0]?.text?.split('\n').filter((line: string) => line.length > 0);

    if(!result) {
      throw new Error('No completion');
    }

    console.log(result);
    res.status(200).json({ 
      result: result 
    });
    
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error?.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateDafSummary(daf: string ) {
        if(daf.length < 1) return 'Invalid prompt';
        return `
          Can you summarise the following daf in 100 words or less?

          ${daf}
        `;
}

// TODO: Add a function to get opinion of Rambam on a given daf
// TODO: Add a function to get opinion of Rashi on a given daf
// TODO: Add a function to get opinion from Shulchan Aruch on a given daf