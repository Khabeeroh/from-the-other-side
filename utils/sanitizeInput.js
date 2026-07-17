import sanitizeHTML from "sanitize-html"

export function sanitizeInput(data){
    
    const sanitizedData = {}

    for(const [key, value] of Object.entries(data)){
        if(typeof value === 'string'){
            sanitizedData[key] = sanitizeHTML(value, { allowedTags: ['b'], allowedAttributes: {}})
        }else{
            sanitizedData[key] = value       
        }
    }

    return sanitizedData

} 
