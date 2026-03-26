export const GENIE_STATUS= {
    IDLE:{
        msg:"Rub the Lamp",
        t:null,
        dot:false
    },
    START:{
        msg:"Waking Up the Genie",
        t:3000,
        dot:true
    },
    WEB_SEARCH:{
        msg:"Searching the Web For",
        t:4000,
        dot:true
    },
    DEFAULT_ACTIVE:{
        msg:"Searching the Perfect Gift",
        t:null,
        dot:true
    },
    DONE:{
        msg:"Your Gift Ideas are Ready!!",
        t:4000,
        dot:false
    }
} as const;

export type GenieStatusKey = keyof typeof GENIE_STATUS;
export type GenieStatusValue = typeof GENIE_STATUS[GenieStatusKey];