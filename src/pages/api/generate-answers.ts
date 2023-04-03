import type { NextApiRequest, NextApiResponse } from "next";
import { openaiConfig } from "~/utils/configs";

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type CompletionRequest = {
  prompt: string;
};

export type CompletionResponse = {
  answer: string;
};

export interface NextApiRequestWithBody<BodyType> extends NextApiRequest {
  body: BodyType;
}

export interface NextResponseWithBody<BodyType> extends NextApiResponse {
  body: BodyType;
}


export default async function handler(
  req: NextApiRequestWithBody<{ messages: ChatCompletionRequestMessage[] }>,
  res: NextApiResponse
) {


  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body.messages,
  })

  res.status(200).json({ result: completion.data })
}