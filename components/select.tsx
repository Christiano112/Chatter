import React from "react";

interface SelectType {
    label?: string;
    name: string;
    placeholder?: string;
    register: any;
    errors?: any;
    options: string[];
}

const Select = ({ label, name, placeholder, register, errors, options, ...props }: SelectType) => {
    return (
        <div className="flex flex-col gap-2 my-8">
            {label && (
                <label htmlFor={name} className="text-sm md:text-lg text-slate-800">
                    {`${label} :`}
                </label>
            )}
            <select
                id={name}
                name={name}
                {...register(name, { required: true })}
                {...props}
                placeholder={placeholder}
                aria-invalid={errors[name] ? "true" : "false"}
                autoSave="true"
                autoCorrect="on"
                spellCheck="true"
                className="p-2 rounded cursor-text text-lg border outline-none bg-white placeholder:text-slate-500 focus:border-blue-800"
            >
                {options.map((option) => (
                    <option key={option} value={option} className="p-2">
                        {option}
                    </option>
                ))}
            </select>
            {errors[name] && (
                <span role="alert" className="text-sm text-red-700">
                    {errors[name].message}
                </span>
            )}
        </div>
    );
};

export default Select;
