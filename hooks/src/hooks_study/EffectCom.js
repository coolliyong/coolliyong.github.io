import React, { useState,useEffect } from 'react'


const EffectCom = prop =>{
    const [title,setTitle] = useState('defaultTitle');
    const name = 0;
    useEffect(eff=>{
        console.log('useEffect');
        document.title = title
    },name)

    const changeTitle = ()=>{
        setTitle('changeTitle1');
    }

    console.log(title)
    return (<div>
        <span>Effect Hook</span>
        <article>
            <p>title:{title}</p>
            <button onClick={changeTitle}>changeTitle</button>
        </article>
    </div>)
}

export default EffectCom