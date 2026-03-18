import dotenv from "dotenv";
import OpenAI from "openai"
dotenv.config();
import express from 'express';
import cors from 'cors';
import {OpenAIResponseError} from "./errors/OpenAIResponseError.js";
import {GENIE_DEV_PROMPT} from "./prompts/genie-gift.js";

const PORT = process.env.PORT || 3000;
const app = express();

const aiClient = new OpenAI({
   baseURL:process.env.AI_URL,
   apiKey:process.env.AI_KEY,
})

app.use(cors());
app.use(express.json());

app.post('/api/ai', async (req, res) => {
   try{
      const {prompt} = req.body;
      const stream = await aiClient.responses.create({
         model:process.env.AI_MODEL || "gpt-4o-mini",
         input:[
            {
               role:"developer",
               content:GENIE_DEV_PROMPT
            },
            {
               role:"user",
               content:prompt
            }
         ],
         tools:[{
            type:"web_search",
            user_location:{
               type:"approximate",
               country:"ID",
               city:"Jakarta"
            }
         }],
         stream:true
      });

      for await (const chunk of stream){
         if(chunk.type === 'response.output_text.delta'){
            res.write(chunk.delta);
         }
      }

      res.status(200).end();

      // if(response.status !== 'completed'){
      //   throw new OpenAIResponseError(
      //       500,
      //       response?.status || "respond_not_completed",
      //       response?.error?.code || "server_error",
      //       response?.error?.message || "Internal Server Error"
      //   )
      // }
      // return res.status(200).json({
      //    answer:response.output_text
      // });

   }catch(err:any | OpenAIResponseError){
      let httpCode: number ;
      let status: string;
      let code: string;
      let message :string;

      console.log(err);

      if(err instanceof OpenAIResponseError){
         httpCode = err.httpCode;
         status = err.responseStatus;
         code = err.errorCodeStr;
         message = err.message;
      }else{
         httpCode = err?.status
         status = err?.type;
         code = err?.code;
         message =  err?.error?.message;
      }
      res.status(httpCode).json({
         status,
         code,
         message
      })
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
