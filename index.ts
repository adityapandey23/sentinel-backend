import { app } from "./src/server"

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})