import Axios from 'axios'

interface CrawlResponse {
    message: string
}

const api = Axios.create({
    baseURL: ' https://21kqq2jgg7.execute-api.us-east-1.amazonaws.com/Prod'
})

async function crawl(character: string, realm: string) {
    const result = await api.post<CrawlResponse>('/crawl', {
        character,
        realm 
    })
    console.log(result.data)
}

export {
    crawl
}