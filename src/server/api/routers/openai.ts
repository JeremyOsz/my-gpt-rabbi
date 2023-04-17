import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { openaiConfig } from "~/utils/configs";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export type CompletionResponse = {
	answer: string;
};


import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import axios from "axios";
import { TRPCError } from "@trpc/server";

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const messages: Message[] = [];


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
			messages.push({
				role: "assistant",
				content: response || "",
			});
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
			messages.push({
				role: "assistant",
				content: response || "",
			});
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
			messages.push({
				role: "assistant",
				content: response || "",
			});
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
			messages.push({
				role: "assistant",
				content: response || "",
			});
			return {
				response: response,
			};
	}),
		generateText: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const { prompt } = input;

      messages.push({
        role: "user",
        content: prompt,
      });

      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages,
        });

        const generatedText = completion.data.choices[0]?.message?.content;

        if (generatedText) {
          messages.push({
            role: completion.data.choices[0]?.message?.role ?? "system",
            content: generatedText,
          });
        }

        return {
          generatedText: generatedText ?? "<no text generated>",
        };
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            message: error.response?.data?.error?.message,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),

  reset: publicProcedure.mutation(() => {
    messages.length = 0;
  }),



	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.example.findMany();
	}),



	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});