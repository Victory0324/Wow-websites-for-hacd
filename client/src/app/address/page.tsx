import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button, Input, Spinner
} from "@material-tailwind/react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateDiamondImageTagSVG } from '../../scripts/diamondsvgimg.js';
import { decideDiamondTypes, DiamondTypeMaps } from '../../scripts/diamondtypes.js';
import { Link } from 'react-router-dom';

interface DiamondItem {
    name : string;
    block_height : string;
    visual_gene : string;
    life_gene : string;
    number : string;
    types : string[];
}
const DiamondsByAddress = () => {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [address, setAddress] = useState<string>('')
    const [diamonds, setDiamonds] = useState<DiamondItem[]>([]);
    const addDiamond = (newDiamond: DiamondItem) => {
        setDiamonds((prevDiamonds) => [...prevDiamonds, newDiamond]);
    };

    const clearDiamonds = () => {
        setDiamonds([]);
    };

    useEffect(() => {
        // var vgene = DiamondLifeGeneConvertVisualGene('c56633c85faa3200d188c5dd66262bcc6044bba16243a8df5e7152fb8dc69405', 'WBKXZN')
        // if(diamondData.visual_gene !== ''){
        //     var diamondSvg = CreateDiamondImageTagSVG(diamondData.visual_gene, 440)
        //     console.log("vgene : " + diamondData.visual_gene)
        //     setDiamondSvg(diamondSvg);
    
        //     const types: DiamondType[] | undefined = decideDiamondTypes(diamondData.visual_gene, diamondData.name, diamondData.number)
            
        //     const responsiveString = getResponsiveString(types);
        //     setDiamondTypes(responsiveString)
        // }
        
    }, []);

    type DiamondType = keyof typeof DiamondTypeMaps;

    // const getResponsiveString =  function(types: DiamondType[] | undefined): string[] {
    //     const responsiveStrings: string[] = [];
    //     if(types !==  undefined){
    //         for (const type of types) {
    //             const responsiveString = DiamondTypeMaps[type];
    //             if (responsiveString !== undefined) {
    //               responsiveStrings.push(responsiveString);
    //             }
    //         }
    //     }
    //     return responsiveStrings;
    // }

    const searchDiamondsByAddress = async () => {
        setLoading(true)
        clearDiamonds()
        if (address === "") {
            setLoading(false)
            toast.error("Required address.");
        }
        else {
            try {
                const response = await axios.get(`https://hacpool.com/api/diamond/account_diamonds?address=${address}`)
                const result = response.data
                
                if (result.error) {
                    //name format error or not exist
                    toast.error(result.error)
                    setLoading(false)
                }
                else {
                    
                    //set diamonds
                    const diamonds = result.diamonds;
                    for (let i = 0; i < diamonds.length; i += 6) {
                        const name = diamonds.slice(i, i + 6);
                        //get detail diamond information
                        try {
                            const response1 = await axios.get(`https://hacpool.com/api/diamond/scan?name=${name}`)
                            const result1 = response1.data
                            
                            if (result1.fail) {
                                console.log(result1.fail);
                            }
                            else {
                                const { types } = decideDiamondTypes(result1.visual_gene, result1.name, result1.number)
                                //set diamond data
                                addDiamond({
                                    name: result1.name,
                                    block_height: result1.block_height,
                                    visual_gene: result1.visual_gene,
                                    life_gene: result1.life_gene,
                                    number: result1.number,
                                    types: types
                                });
                            }
                        } catch (error) {
                            console.error('Error fetching diamond data:', error)
                            // toast.error("Error fetching data")
                        }
                    }
                    
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching diamond data:', error)
                toast.error("Error fetching data")
                setLoading(false)
            }
        }
    }

    return (
        <div className='flex flex-col min-h-screen items-center bg-gradient-to-tr from-[#020038] to-[#40057d] py-10 sm:py-20'>
            <div className='container'>
                <div className='mx-auto rounded-lg p-4 sm:p-10 bg-gradient-to-r from-[#1d1e30] to-[#11131f] text-white text-center'>
                        
                    <div className={`flex flex-row justify-center ${isLoading ? 'visible' : 'invisible'}`}>
                        <Spinner className="h-8 w-8 ml-2" color="blue"/>
                    </div>
                    <div className='flex flex-row justify-center pb-10 pt-5 items-center'>
                        <div className='w-96'>
                            <Input color="white" size="lg" label="Address" value={address} onChange={(event) => setAddress(event.target.value)} />
                        </div>
                        
                        <Button onClick={searchDiamondsByAddress} className="flex items-center mx-1 bg-[#4e327c]" disabled={isLoading} size="md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="h-5 w-5" viewBox="0 0 19.9 19.7">
                                <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/>
                            </svg>
                        </Button>
                    </div>
            
                    <ToastContainer />
                    {
                        diamonds.length > 0 ? (
                            <div>
                                {Object.entries(DiamondTypeMaps).map(([key, value]) => (
                                    <div key={`types-${key}`} className='flex flex-col'>
                                        <Typography className="text-left font-bold text-xl">{value}</Typography>
                                        <div className="grid grid-cols-2 sm:grid-cols-8 gap-1 my-3 sm:gap-2 sm:my-5 mx-2 justify-center">
                                            {diamonds.map((item, index) => {
                                                if(item.types.includes(key)){
                                                    return (
                                                        <div key={`types-${key}-${index}`} className='flex flex-col mb-1 relative transition hover:scale-110'>
                                                            
                                                            <Link 
                                                                to={`https://explorer.hacash.diamonds/diamond/${item.name}`} 
                                                                className='text-white hover:font-bold mx-2 py-2 bg-[#a855f7] hover:bg-[#e879f9] rounded-md flex flex-col items-center'
                                                                target="_blank">
                                                                <div dangerouslySetInnerHTML={{ __html: CreateDiamondImageTagSVG(item.visual_gene, 50) }} className='mb-1'/>
                                                                {item.name}
                                                            </Link>
                                                            <p className='text-white text-[9px] absolute top-[6px] left-[15px]'>#{item.number}</p>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                    
                                ))}
                            </div>
                            
                        ) : (
                            <div>
                                <p>Enter HACD Holding Address</p>
                            </div>
                        )
                    }
                    
                </div>

            </div>
        </div>
        
    )
}

export default DiamondsByAddress;