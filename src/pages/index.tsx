import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { DafYomi } from "@hebcal/core";
import * as DOMPurify from 'dompurify';

import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { fetchCompletion, getDaf } from "~/utils/dataSources";
import type { SefariaResponse } from "~/utils/dataSources";
import { generateDafSummary } from "~/utils/promptHelpers";
import Card from "~/components/card";


type Results = string[];

const Home: NextPage = () => {
  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState<string>();
  const [comments, setComments] = useState<string>();
  const [rashi, setRashi] = useState<string>();
  const [daf, setDaf] = useState<SefariaResponse>();
  

  const getDaileyDaf = () : void => {
    getDaf(new Date()).then((daf) => {
      console.log('daf', daf);
      setDaf(daf);

    }).catch((error) => {
      console.error('error fetching daily daf', error);
    });
  }

  useEffect(() => {
    if (!daf) return;
    const dafContent = daf.text.join(' ') || '';
    const prompt = generateDafSummary(dafContent, daf.ref);
    console.log('prompt', prompt);
    fetchCompletion(prompt).then((completion) => {
      setResult(completion.answer);
    }).catch((error) => {
      console.error('error fetching completion', error);
    });
  }, [daf]);

  useEffect(() => {
    if (!result || !daf ) return;
    const prompt = `What is Rambam's view on ${daf.ref}?`;
    fetchCompletion(prompt).then((completion) => {
      setComments(completion.answer);
    }).catch((error) => {
      console.error('error fetching completion', error);
    });
  }, [result, daf]);

  useEffect(() => {
    if (!result || !daf ) return;
    const prompt = `What is Rashi's view on ${daf.ref}?`;
    fetchCompletion(prompt).then((completion) => {
      setRashi(completion.answer);
    }).catch((error) => {
      console.error('error fetching completion', error);
    });
  }, [result, daf]);

  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#848cff] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            My <span className="text-indigo-700">GPT</span> Rabbi
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8 w-full">
            <button onClick={getDaileyDaf} className="rounded-full bg-white/50 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/70">Get Daf</button>

            {/* Daf Summary */}
            <Card>
              <h2 className="font-bold text-lg"> {daf?.ref} </h2>
              {
                result && (
                  <div className="font-serif font-neutral-normal leading-10 text-black-100 tracking-wide">
                    <h3 className="font-bold text-lg py-4"> Here is a summary of {daf?.ref}: </h3>
                    <div>
                      { <p key={Math.random()}>{result}</p> }
                    </div>
                    
                    <h3 className="font-bold text-lg py-4"> Rambam Says: </h3>
                    <div>
                      { <p key={Math.random()}>{comments}</p> }
                    </div>

                    <h3 className="font-bold text-lg py-4"> Rashi Says: </h3>
                    <div>
                      { <p key={Math.random()}>{rashi}</p> }
                    </div>
                  </div>


                  
                )

              }      
            </Card>

            {/* Full Daf */}
            <Card>
            <div className="font-serif font-neutral-normal leading-10 text-black-100 tracking-wide">
                {daf?.text.map((line, index) => {
                    return <p className="py-2 " key={index} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(line.join())}} />
                  })
                }
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8 w-full">
{/* 
            <div className="flex flex-col gap-1 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <form onSubmit={onSubmit}>
              <textarea value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} className="text-black w-full max-w-100 h-20 p-5"/>
              <button type="submit" className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 block m-auto my-5">Submit</button>
              </form>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 max-w-100 overflow-clip">
              {questionInput && <p className="font-semibold">{questionInput}</p>}
              {result && result.map((answer: string) => <p>{answer}</p>)}
            </div> */}
          </div>
          {/* <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div> */}
        </div>
      </main>
    </>
  );
};
    


export default Home;
{/* 
const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}; */}




  // async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch("/api/generate-answers", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ question: questionInput, daf: daf }),
  //     });
  
  //     const data = await response.json();
  //     if (response.status !== 200) {
  //       throw data.error || new Error(`Request failed with status ${response.status}`);
  //     }
  
  //     setResult(data.result);
  //     setQuestionInput("");
  //   } catch(error: any) {
  //     // Consider implementing your own error handling logic here
  //     console.error(error);
  //     alert(error.message);
  //   }
  // }
