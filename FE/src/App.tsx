import './App.css'
import genie from './assets/genie.svg'
import lamp from './assets/lamp.svg'
import {useCallback, useRef, useState} from "react";
import { motion } from "motion/react";
import AIResponse from "./components/AIResponse.tsx";
import LoadingDots from "./components/LoadingDots.tsx";

function App() {
    const [prompt,setPrompt] = useState<string>('');
    const [isRubbed,setIsRubbed] = useState<boolean>(false);
    const lastPromptRef = useRef<string>("");

    function handleClick(){
        const trimmed = prompt.trim();
        if(!trimmed) return;
        if(isRubbed) return;
        if(trimmed === lastPromptRef.current) return;
        lastPromptRef.current = trimmed;
        setIsRubbed(true);
    }

    const handleFinish = useCallback(()=>{
       setIsRubbed(false);
    },[]);

    return (
        <main className={"w-full flex flex-row justify-center ai-content"}>
            <div className={"w-4/5 flex flex-col gap-5 max-w-4xl items-center"}>
                <section className="w-full flex flex-row justify-center items-center">
                    <img src={genie} alt="Genie Logo" className="w-[24.5%] sm:w-[11%] lg:w-[8.5%] genie-svg"/>
                    <h1 className="font-poppins font-extrabold text-5xl text-white
                     text-shadow-white text-shadow-xl app-title">Gift Genie</h1>
                </section>
                <section className="w-full flex flex-col items-center mt-5">
                      <textarea id="prompt-input"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., My friend who loves hiphop music has a birthday coming up in 3 days. 40-60 bucks budget.I live in..."
                                rows={3}
                                className="text-white placeholder-gray-500  font-semibold w-full outline-none focus:outline-none"
                      />
                    <hr className="border-gray-500 border-t-2 w-full"/>
                </section>
                <section className="flex flex-col gap-1 items-center w-full">
                    <button
                        className={"w-1/3 sm:w-1/4 lg:w-1/5"}
                        onClick={handleClick}
                    >
                        {!isRubbed && <img src={lamp}
                             alt="Lamp Button"
                             className="lamp-svg transition-all duration-300 ease-in-out hover:scale-110 hover:-rotate-5"/>}
                        {isRubbed && <motion.img
                            src={lamp}
                            alt="Genie Lamp"
                            className="lamp-svg transition-all duration-300 ease-in-out"
                            onClick={handleClick}
                            animate={
                                isRubbed
                                    ? {
                                        scale: [1, 1.35, 1],
                                        x: [0, -10, 10, -10, 10, 0],
                                        rotate: [0, -20, 20, -20, 20, 0],
                                        filter: [
                                            "drop-shadow(0 0 8px lch(92% 90 97))",
                                            "drop-shadow(0 0 5px lch(85% 60 95))",
                                            "drop-shadow(0 0 8px lch(92% 90 97))",
                                        ],
                                    }
                                    : {
                                        scale: 1,
                                        x: 0,
                                        rotate: 0,
                                    }
                            }
                            transition={
                                isRubbed
                                    ? {
                                        duration: 0.8,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }
                                    : {
                                        duration: 0.2,
                                    }
                            }
                            whileHover={!isRubbed ? { scale: 1.1, rotate: -5 } : undefined}
                        />}
                    </button>
                    <div className={"flex flex-row items-end"}>
                        {!isRubbed &&
                            <p className="text-gray-400 text-xl font-bold rub-text">
                                Rub the Lamp
                            </p>
                        }
                        {isRubbed &&  <p className="text-gray-400 text-xl font-bold rub-text">
                            Searching For the Best Gifts
                        </p> }
                        {isRubbed && <div className={"flex flex-col"}>
                            <LoadingDots></LoadingDots>
                        </div>}
                    </div>

                </section>
                <section className="w-full flex flex-row justify-center">
                    <AIResponse isRubbed={isRubbed}
                                onFinish={handleFinish}
                                prompt={prompt}></AIResponse>
                </section>
            </div>
        </main>
        // <main className={"w-full"}>
        //     <section className="w-full flex flex-row justify-center items-center">
        //         <img src={genie} alt="Genie Logo" className="w-[22.5%] sm:w-[9%] lg:w-[6.5%] genie-svg"/>
        //         <h1 className="font-poppins font-extrabold text-5xl text-white
        //         text-shadow-white text-shadow-xl app-title">Gift Genie</h1>
        //     </section>

        // </main>
    )
}

export default App
