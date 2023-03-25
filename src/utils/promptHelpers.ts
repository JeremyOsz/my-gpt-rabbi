
// Clean a string to only essential elements
const cleanPrompt = (prompt: string) => {
    console.log('prompt', prompt)
    // Remove all html tags
    prompt = prompt.replace(/(<([^>]+)>)/gi, '');

    // Trim to 1000 characters
    return prompt.trim().slice(0, 1000);
}

const generateDafSummary = (daf: string, ref?: string ) => {
    console.log('daf', daf)
    if(daf.length < 1) return 'Invalid prompt';

    return `
      Can you summarise the following daf in 100 words or less?

      ${ref || ''}
        
      ${cleanPrompt(daf)}
    `;
}



export { generateDafSummary }