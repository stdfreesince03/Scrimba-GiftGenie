import {useEffect, useRef, useState} from "react";
import {marked} from "marked";
import DOMPurify from "dompurify";
import useGeoLocation from "../hooks/useGeoLocation.ts";
import type {StatusText} from "../constants/statusText.ts";
import {toTitleCase} from "../utils/case.ts";

interface AIResponseParameter {
    isRubbed:boolean; //has been rubbed, currently loading or streaming
    prompt:string;
    onFinish : ()=>void;
    updateStatus:(newStatusText:StatusText)=>void;
}

export default function AIResponse({isRubbed,prompt,onFinish,updateStatus}: AIResponseParameter){
    const [res, setRes] = useState<string>(() => {
        return localStorage.getItem("ai_response") || "";
    });

    const {error,geolocation} = useGeoLocation();
    const beUrl:string = import.meta.env.VITE_BE_URL;

    useEffect(()=>{
        if(!isRubbed) return;
        async function fetchData(){
            setRes("");
            try{
                const response = await fetch(`${beUrl}/api/ai`,{
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            prompt,
                            lat: geolocation?.latitude || null,
                            lon: geolocation?.longitude || null
                        }
                    )
                });
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                let fullText = "";
                let buffer = "";
                while(true){
                    const{done,value} = await reader.read();
                    if(done)break;

                    buffer += decoder.decode(value,{stream:true});
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for(const line of lines){
                        const trimmedLine = line.trim();
                        try{
                            const json = JSON.parse(trimmedLine);
                            if(json.type === 'response.output_text.delta'){
                                fullText += json.content;
                                const newRawHtml = await marked.parse(fullText);
                                const newCleanHtml = DOMPurify.sanitize(newRawHtml);
                                setRes(newCleanHtml);
                                updateStatus({
                                    type:json.type,
                                    msg:"Magic in progress",
                                    dot:true
                                });
                            }else if (json.type === 'response.output_item.done' && json.content) {
                                updateStatus({
                                    type:json.type,
                                    msg:`Searching the web for "${toTitleCase(json.content)}"`,
                                    dot:true
                                });
                            }
                            else if (json.type === 'response.output_text.done') {
                                updateStatus({
                                    type:json.type,
                                    msg:'Magic delivered. Behold your bounty ✨✨✨',
                                    dot:false
                                });
                                await new Promise((res)=>setTimeout(res,4000));
                                updateStatus({
                                    type:"",
                                    msg:'Rub The Lamp',
                                    dot:false
                                });

                            }else if(json.type === 'response.in_progress'){
                                updateStatus({
                                    type:json.type,
                                    msg:'Waking Up The Genie',
                                    dot:true
                                });
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }

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