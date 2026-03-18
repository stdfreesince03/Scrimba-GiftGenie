import {useEffect, useState} from "react";
import axios from 'axios';
import {marked} from "marked";
import DOMPurify from "dompurify";


interface AIResponseParameter {
    isRubbed:boolean; //has been rubbed, currently loading or streaming
    prompt:string;
    onFinish : ()=>void;
}

export default function AIResponse({isRubbed,prompt,onFinish}: AIResponseParameter){
    const [res, setRes] = useState<string>(() => {
        return localStorage.getItem("ai_response") || "";
    });

    const beUrl:string = import.meta.env.VITE_BE_URL;


    useEffect(()=>{
        if(!isRubbed) return;
        async function fetchData(){
            try{
                const response = await fetch(`${beUrl}/api/ai`,{
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({prompt})
                });
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                let fullText = "";
                while(true){
                    const{done,value} = await reader.read();
                    if(done)break;
                    const chunk = decoder.decode(value,{stream:true});
                    fullText += chunk;
                    const newRawHtml = await marked.parse(fullText);
                    const newCleanHtml = DOMPurify.sanitize(newRawHtml);
                    setRes(newCleanHtml);
                }
            }catch(error : unknown){
                console.log(error instanceof Error ? error.message : error);
            }finally{
                onFinish();
            }
        }
        fetchData();
    },[isRubbed, onFinish]);

    useEffect(() => {
        localStorage.setItem("ai_response", res);
    }, [res]);

    return (
        <div
            className="w-full text-white list-inside"
            dangerouslySetInnerHTML={{ __html: res }}
        />
    )
}