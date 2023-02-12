import { Configuration, OpenAIApi } from 'openai'


export async function chat(prompt: string, key: string)  {
    const config = new Configuration({
        apiKey: key
    })
    const openai = new OpenAIApi(config)
    const res = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 2000,
        top_p: 1,
        prompt
    })
    return res.data.choices[0]
    ?.text
    ?.replace(/^(\n+)/g, '')
}
