document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form")
  const formMessageText = document.getElementById("formMessageText")

  if (!form) {
    console.error("Upload form not found")
    return
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const location = document.getElementById("location").value
    const title = document.getElementById("title").value
    const text = document.getElementById("details").value
    const isoDateString = document.getElementById("datetime").value

    if (!isoDateString) {
      if (formMessageText) {
        formMessageText.textContent = "Please select a date and time!"
      }
      return
    }

    const date = new Date(isoDateString)
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
    const readableDate = date.toLocaleString("en-US", options)

    const formData = {
      location: location,
      timeStamp: readableDate,
      title: title,
      text: text,
    }

    try {
      if (formMessageText) {
        formMessageText.textContent = ""
      }

      const response = await fetch("./api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        if (formMessageText) {
          formMessageText.innerHTML =
            'Your sighting was uploaded. View it <a href="./Read.html">here</a>.'
        }
        form.reset()
      } else {
        if (formMessageText) {
          formMessageText.textContent =
            "The server Ghosted you(!). Please try again."
        }
        console.error("Server Error:", response.statusText)
      }
    } catch (err) {
      if (formMessageText) {
        formMessageText.textContent =
          "Unable to submit sighting. Please try again."
      }
      console.error(err)
    }
  })
})