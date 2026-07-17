const eventSource = new EventSource("/api/news")

const liveContainer = document.getElementById('news-display')

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const story = data.story
    liveContainer.textContent = story
}

eventSource.onerror = () => {
    console.log("Connection lost. Attempting to reconnect....")
}