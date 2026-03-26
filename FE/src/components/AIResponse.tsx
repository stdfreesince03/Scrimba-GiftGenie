import {useEffect, useRef, useState} from "react";
import {marked} from "marked";
import DOMPurify from "dompurify";
import useGeoLocation from "../hooks/useGeoLocation.ts";
import type {GenieStatusKey} from "../constants/genieStatus.ts";
import { GENIE_STATUS } from "../constants/genieStatus";

interface AIResponseParameter {
    isRubbed:boolean; //has been rubbed, currently loading or streaming
    prompt:string;
    onFinish : ()=>void;
}


export default function AIResponse({isRubbed,prompt,onFinish}: AIResponseParameter){
    const [res, setRes] = useState<string>(() => {
        return localStorage.getItem("ai_response") || "";
    });
    // const [status,setStatus] = useState<GenieStatusKey>("IDLE");
    // const coolDown = useRef<boolean>(false);

    const {error,geolocation} = useGeoLocation();
    const beUrl:string = import.meta.env.VITE_BE_URL;

    // async function updateStatus(newStatus:GenieStatusKey){
    //     if(coolDown.current) return;
    //     coolDown.current = true;
    //
    //     const {t} = GENIE_STATUS[newStatus];
    //     setStatus(newStatus);
    //     if(t){
    //         await new Promise(resolve => setTimeout(resolve, t));
    //     }
    //     coolDown.current = false;
    // }

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