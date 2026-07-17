import path from "node:path"
import fs from "node:fs/promises"
import { getData } from "../utils/getData.js"
import { parseJSONBody } from "../utils/parseJSONBody.js"
import { sendResponse } from "../utils/sendResponse.js"
import { addNewSighting } from "../utils/addNewSighting.js"
import { sanitizeInput } from "../utils/sanitizeInput.js"
import { sightingEvents } from "../events/sightingEvents.js"
import { stories } from "../data/stories.js"


export async function handleGet(res){
    const data = await getData()
    const content = JSON.stringify(data)
    sendResponse(res, 200, "application/json", content)
}

export async function handlePost(req, res) {

    try {
         const parsedBody = await parseJSONBody(req)
         const sanitizedBody = sanitizeInput(parsedBody)
         await addNewSighting(sanitizedBody)
         sightingEvents.emit('sighting-added', sanitizedBody)
        
         sendResponse(res, 201, 'application/json', JSON.stringify(sanitizedBody))   
    } catch (error) {
        sendResponse(res, 400, 'application/json', JSON.stringify({error: error}))
    }
   

}


export async function handleNews(req, res){
    const acceptHeader = req.headers.accept || ""

    if (acceptHeader.includes("text/html")) {
        const newsPagePath = path.join(process.cwd(), "public", "news.html")

        try {
            const content = await fs.readFile(newsPagePath)
            sendResponse(res, 200, "text/html", content)
            return
        } catch (error) {
            sendResponse(res, 500, "text/html", "<html><body>Unable to load the news page.</body></html>")
            return
        }
    }

    res.statusCode = 200
    res.setHeader("Content-type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * stories.length)

        res.write(
            `event: news-updated\ndata: ${JSON.stringify({
                story: stories[randomIndex]})}\n\n`
        )
    }, 3000)
}