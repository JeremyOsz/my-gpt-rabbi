// import type { NextApiRequest, NextApiResponse } from "next";
// import { Configuration, OpenAIApi } from "openai";
// import { openaiConfig } from "~/utils/configs";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// type CompletionRequest = {
//   prompt: string;
// };

// export type CompletionResponse = {
//   answer: string;
// };


// const getOpenAIChat = async (req: NextApiRequestWithBody<CompletionRequest>, res: NextResponseWithBody<CompletionRequest>, ) => {
//   const { prompt } = req.body;

//   if (prompt.length === 0) {
//     res.status(400).json({
//       error: {
//         message: "Please enter a valid question",
//       }
//     });
//     return;
//   }

//   try{
//     const completion = await openai.createCompletion(
//       {
//         model: "text-davinci-003",
//         temperature: 0.7,
//         max_tokens: 2000,
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//         prompt: prompt,
//       }
//       )
//     console.log('completion', completion)
//     const response = completion.data.choices[0]?.text;
//     res.status(200).json({
//       answer: response
//     });
//   }
//   catch(error){
//     console.log(error)
//     res.status(500).json({
//       error: {
//         message: "Something went wrong",
//         error: error
//       }
//     });
//   }
 

// };

// export default getOpenAICompletion;



