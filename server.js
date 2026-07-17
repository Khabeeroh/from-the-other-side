import http from "node:http"
import { serveStatic } from "./utils/serveStatic.js"
import { handleGet, handlePost, handleNews } from "./handlers/routeHandlers.js"


const PORT = 8000

const _dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {
    if(req.url === "/api"){

        if(req.method === 'GET'){
            return await handleGet(res)

        }else if(req.method === 'POST'){
            return await handlePost(req, res)
        }

    }else if(req.url === "/api/news"){

        return await handleNews(req, res)

    }else if(!req.url.startsWith("/api")){

         return await serveStatic(req, res, _dirname)
    }    
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))

 
//  const PathToResources = path.join(_dirname, "public", "index.html")
//     const relPathToResources = path.join("public", "index.html")
//      console.log('absolute', PathToResources)
//     console.log('relative', relPathToResources)
//     res.writeHead(200, {"Content-Type": "text/html"})