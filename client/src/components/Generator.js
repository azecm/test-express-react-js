import React, {useCallback, useEffect, useRef, useState} from "react";

export function Generator() {
    const [next, setNext] = useState([]);
    const [nextTick, setNextTick] = useState(500);
    const refInput = useRef();

    const onNext = useCallback(()=>{
        setNext(sendData(getData()));
    }, []);
    useEffect(()=>{
        let timer = setTimeout(onNext, nextTick);
        return () => {
            clearTimeout(timer);
        }
    });

    const onChange = ()=>{
        if(refInput && refInput.current){
            setNextTick(refInput.current.valueAsNumber);
        }
    };

    return (<>
        <h1>Data Generator</h1>
        <p>
            <input type="range" min="100" max="2000" step="100" value={nextTick} onChange={onChange} ref={refInput}/>
            {nextTick} ms
        </p>
        <p>update Ids: {next?.map((i)=>i.id).join('-')}</p>
    </>);
}


function getData() {
    const data = [];
    for(let i=1;i<21;i++){
        if(Math.random()>0.6){
            data.push(getDataRow(i+''));
        }
    }
    return data;
}

function getDataRow(id) {
    const data = {id};
    for (let i = 1; i < 21; i++) {
        data['p' + i] = (Math.round(Math.random() * 20000) - 10000)/10000;
    }
    return data;
}

function sendData(data) {
    if(data.length) {
        fetch('/api/listener', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(null, () => console.log('error'));
    }
    return data;
}
