import React from 'react'
import {useState,useEffect} from 'react';
import Select from "react-tailwindcss-select";
import { genreOptions } from './Components/Options';
import {useNavigate,Link} from 'react-router-dom'; 

const Form = () => {
  const [genres, setGenres] = useState(null);
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [runtime, setRuntime] = useState("");

  const navigate = useNavigate();

  const handleChange = value => {
    setGenres(value);
  };

  const onSubmit = async (e) => {
    navigate("/RandomMovie",{state:genres})
  }

  return (
    <div>
    <form onSubmit={onSubmit}>
    <div className="flex flex-col mx-auto w-3/4 p-5">
        <h1 className="m-auto mb-4 text-2xl font-extrabold leading-none tracking-tight text-black md:text-3xl lg:text-4xl dark:text-grey">Find A Random Movie With The Following Filters</h1>
        <div className="text-center pt-5">
            <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-info md:text-xl lg:text-2xl dark:text-grey">Genre</h1>
            <div className="w-1/2 mx-auto">
            <Select
            value={genres}
            onChange={handleChange}
            options={genreOptions}
            isMultiple={true}
            formatGroupLabel={data => (
                <div className={`py-2 text-xs flex items-center justify-between`}>
                    <span className="font-bold">{data.label}</span>
                    <span className="bg-gray-200 h-5 h-5 p-1.5 flex items-center justify-center rounded-full">
                        {data.options.length}
                    </span>
                </div>
            )}
            />
            </div>
        </div>
        <div className="pt-5 items-center mx-auto">
        <button className="btn btn-info btn-wide text-white">Get Random Movie</button>
        </div>
    </div>
    </form>
    </div>
  )
}

export default Form