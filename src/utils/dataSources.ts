import { DafYomi } from "@hebcal/core";
import { NextResponse } from "next/server";
import { CompletionResponse, NextResponseWithBody } from "src/pages/api/generate-answers";
import { type } from "os";


// Infer type from Nazir
export type SefariaResponse = {
    book: string;
    categories: string[];
    commentary: {
        _id: string;
        anchorRef: string;
        anchorText: string;
        anchorVerse: number;
        category: string;
        commentaryNum: number;
        commentator: string;
        he: string;
        ref: string;
        sourceRef: string;
        text: string;
        type: string;
    }[];
    he: string[][];
    heVersionSource: string;
    heVersionTitle: string;
    length: number;
    maps: [];
    next: string;
    order: number[];
    prev: string;
    ref: string;
    sectionNames: string[];
    sections: number[];
    text: string[][];
    titleVariants: string[];
    toSections: number[];
    type: string;
    versionSource: string;
    versionTitle: string;
    versions: {
        language: string;
        versionTitle: string;
    }[];
}



const getSefaria = async (daf: string) : Promise<SefariaResponse> => {
    const response = await fetch(`https://www.sefaria.org/api/texts/${daf}?context=0&commentary=0`);
    const data = await response.json() as SefariaResponse;
    return data;
}

const getDaf = async ( date : Date ) : Promise<SefariaResponse> => {
    const daf = new DafYomi(date);
    const dafText = await getSefaria(daf.render())
    return dafText;
} 

const cleanPrompt = (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    const truncatedPrompt = trimmedPrompt.slice(0, 1000);
    return truncatedPrompt;
}

const fetchCompletion = async (prompt: string): Promise<CompletionResponse>=> {
    if(prompt.length < 1) throw new Error('Invalid prompt');
    cleanPrompt(prompt)
    const response = await fetch('/api/generate-answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    }) as NextResponse;

    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
}


export { getDaf, getSefaria, fetchCompletion}