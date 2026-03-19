import {useEffect, useState} from "react";

export default function useGeoLocation(){
    const [error,setError] = useState<string>("");
    const [geolocation, setGeolocation] = useState<{latitude:number|null,longitude:number|null}>({latitude: null,longitude:null});

    useEffect(()=>{
        if(!navigator.geolocation){
            setError("Geolocation is not supported by your browser");
            return;
        }
        function successCallback(pos:GeolocationPosition){
            setGeolocation({latitude:pos.coords.latitude,longitude:pos.coords.longitude});
        }
        function errorCallback(error:GeolocationPositionError){
            setError("Geolocation Error: " + error.message);
        }
        async function fetchGeolocation(){
            await navigator.geolocation.getCurrentPosition(
             successCallback, errorCallback
            )
        }
        fetchGeolocation();
    },[]);

    return {error,geolocation}
}