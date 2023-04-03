import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { openaiConfig } from "~/utils/configs";

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

// Zod schema for ChatCompletion based on the type ChatCompletionRequestMessage[]
const CompletionRequestSchema = z.array(z.object({ 
	// Role is eithe "assistant" "system" or "user"
	role: z.enum(["assistant", "system", "user"]),
	content: z.string(),
 }));



import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";

export const openaiRouter = createTRPCRouter({
	getSummary: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(async ({ input }) => {
			const completion = await openai.createCompletion({
				...openaiConfig,
				prompt: input.text,
			});
			console.log('completion', completion)
			const response = completion.data.choices[0]?.text;
			return {
				response: response,
			};
		}),
	getRambam: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(async ({ input }) => {
			const prompt = `What is Rambam's opinion on the following Daf Yomi ${input.text}?}`
			const completion = await openai.createCompletion({
				...openaiConfig,
				prompt: prompt,
			});
			console.log('completion', completion)
			const response = completion.data.choices[0]?.text;
			return {
				response: response,
			};
		}),
	getRashi: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(async ({ input }) => {
			const prompt = `What is Rashi's opinion on the following Daf Yomi ${input.text}?}`
			const completion = await openai.createCompletion({
				...openaiConfig,
				prompt: prompt,
			});
			console.log('completion', completion)
			const response = completion.data.choices[0]?.text;
			return {
				response: response,
			};
	}),
	getGemara: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(async ({ input }) => {
			const prompt = `
				Which Rabbis give commentary in the gemara of ${input.text}?}

				and where do they disagree?
			`
			const completion = await openai.createCompletion({
				...openaiConfig,
				prompt: prompt,
			});
			console.log('completion', completion)
			const response = completion.data.choices[0]?.text;
			return {
				response: response,
			};
	}),
	getGemaraDisagreement: publicProcedure
		.input(z.object({ ref: z.string(), rabbi: z.string() }))
		.query(async ({ input }) => {
			const prompt = `
				Where do the following Rabbis (${input.rabbi}) disagree in the gemara of ${input.ref}?}
			`
			const completion = await openai.createCompletion({
				...openaiConfig,
				prompt: prompt,
			});
			console.log('completion', completion)
			const response = completion.data.choices[0]?.text;
			return {
				response: response,
			};
	}),
	getChatResponse: publicProcedure
		.input(z.object({messages: CompletionRequestSchema}))
		.query(async ({ input }) => {
			const completion = await openai.createChatCompletion({
				...openaiConfig,
				messages: input.messages,
			});
			console.log('completion', completion)
			const response = completion.data;
			const content = completion;
			return [
				...input.messages,
			];
		}),


	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.example.findMany();
	}),



	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});