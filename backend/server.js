import { server } from "./index.js";
const PORT=process.env.PORT
server.listen(PORT ,()=>{
    console.log(`SERVER IS RUNNING AT PORT ${PORT}`);
    
})